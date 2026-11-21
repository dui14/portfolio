//#region src/domain/contact.ts
var CONTACT_LIMITS = {
	nameMin: 1,
	nameMax: 80,
	messageMin: 10,
	messageMax: 1e3
};
function validateContactMessage(message) {
	const errors = {};
	if (!message.name.trim()) errors.name = "nameRequired";
	else if (message.name.length > CONTACT_LIMITS.nameMax) errors.name = "nameTooLong";
	if (!message.email.trim()) errors.email = "emailRequired";
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.email)) errors.email = "emailInvalid";
	if (!message.message.trim()) errors.message = "messageRequired";
	else if (message.message.length < CONTACT_LIMITS.messageMin) errors.message = "messageTooShort";
	else if (message.message.length > CONTACT_LIMITS.messageMax) errors.message = "messageTooLong";
	return errors;
}
//#endregion
//#region server/contact/handler.ts
var SETTINGS = {
	maxBodyBytes: 8 * 1024,
	emailMax: 254,
	rateLimitMax: 5,
	rateWindowMs: 600 * 1e3,
	rateMaxEntries: 5e3,
	rateSweepEvery: 256,
	resendTimeoutMs: 8e3,
	resendUrl: "https://api.resend.com/emails",
	defaultOrigins: ["https://duii.dev", "https://www.duii.dev"],
	localHosts: [
		"localhost",
		"127.0.0.1",
		"[::1]"
	],
	subjectPrefix: "Portfolio contact from"
};
var CONTROL_CHARS = /[\p{Cc}\p{Zl}\p{Zp}]+/gu;
function jsonResponse(status, payload, extraHeaders = {}) {
	return {
		status,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "no-store",
			...extraHeaders
		},
		body: JSON.stringify(payload)
	};
}
function fail(status, error, extraHeaders = {}) {
	return jsonResponse(status, {
		ok: false,
		error
	}, extraHeaders);
}
function readHeader(headers, name) {
	return headers[name] ?? "";
}
function resolveClientIp(headers, socketAddress, trustCloudflare) {
	const forwarded = readHeader(headers, "x-forwarded-for").split(",")[0].trim();
	const cloudflare = readHeader(headers, "cf-connecting-ip").trim();
	const real = readHeader(headers, "x-real-ip").trim();
	return (trustCloudflare ? [
		cloudflare,
		forwarded,
		real
	] : [
		forwarded,
		cloudflare,
		real
	]).find((value) => value.length > 0) ?? socketAddress;
}
function isAllowedOrigin(origin, env, allowLocalhost) {
	const configured = (env.CONTACT_ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim().replace(/\/+$/, "")).filter((value) => value.length > 0);
	if ((configured.length > 0 ? configured : SETTINGS.defaultOrigins).includes(origin)) return true;
	if (!allowLocalhost) return false;
	try {
		const { hostname } = new URL(origin);
		return SETTINGS.localHosts.some((host) => host === hostname || host === `[${hostname}]`);
	} catch {
		return false;
	}
}
function createRateLimiter(now) {
	const hits = /* @__PURE__ */ new Map();
	function prune(timestamps, current) {
		return timestamps.filter((time) => current - time < SETTINGS.rateWindowMs);
	}
	function sweep(current) {
		for (const [key, timestamps] of hits) {
			const fresh = prune(timestamps, current);
			if (fresh.length === 0) hits.delete(key);
			else hits.set(key, fresh);
		}
		while (hits.size > SETTINGS.rateMaxEntries) {
			const oldest = hits.keys().next().value;
			if (oldest === void 0) break;
			hits.delete(oldest);
		}
	}
	return function allow(ip) {
		const current = now();
		if (hits.size >= SETTINGS.rateMaxEntries) sweep(current);
		const fresh = prune(hits.get(ip) ?? [], current);
		if (fresh.length >= SETTINGS.rateLimitMax) {
			hits.set(ip, fresh);
			return false;
		}
		fresh.push(current);
		hits.set(ip, fresh);
		if (hits.size % SETTINGS.rateSweepEvery === 0) sweep(current);
		return true;
	};
}
function isJsonContentType(value) {
	return /^application\/json\s*(;|$)/i.test(value.trim());
}
function asText(value) {
	return typeof value === "string" ? value : null;
}
function createContactHandler(options = {}) {
	const doFetch = options.fetch ?? fetch;
	const now = options.now ?? Date.now;
	const allowLocalhost = options.allowLocalhost ?? false;
	const allow = createRateLimiter(now);
	async function process(request, env) {
		if (request.method.toUpperCase() !== "POST") return fail(405, "validation", { Allow: "POST" });
		const origin = readHeader(request.headers, "origin");
		if (origin && !isAllowedOrigin(origin, env, allowLocalhost)) return fail(403, "validation");
		if (!isJsonContentType(readHeader(request.headers, "content-type"))) return fail(415, "validation");
		if (!allow(request.ip)) return fail(429, "rate_limit");
		if (Buffer.byteLength(request.bodyText, "utf8") > SETTINGS.maxBodyBytes) return fail(413, "validation");
		let parsed;
		try {
			parsed = JSON.parse(request.bodyText);
		} catch {
			return fail(400, "validation");
		}
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return fail(400, "validation");
		const record = parsed;
		const honeypot = record.website;
		if (honeypot !== void 0 && honeypot !== null && !(typeof honeypot === "string" && honeypot.length === 0)) return jsonResponse(200, { ok: true });
		const name = asText(record.name);
		const email = asText(record.email);
		const message = asText(record.message);
		if (name === null || email === null || message === null) return fail(400, "validation");
		const clean = {
			name: name.trim(),
			email: email.trim(),
			message: message.trim()
		};
		if (clean.name.length < CONTACT_LIMITS.nameMin || clean.email.length > SETTINGS.emailMax || Object.keys(validateContactMessage(clean)).length > 0) return fail(400, "validation");
		const apiKey = env.RESEND_API_KEY;
		const to = env.CONTACT_TO_EMAIL;
		const from = env.CONTACT_FROM_EMAIL;
		if (!apiKey || !to || !from) return fail(500, "server");
		const subjectName = clean.name.replace(CONTROL_CHARS, " ").trim();
		const payload = {
			from,
			to: [to],
			reply_to: clean.email,
			subject: `${SETTINGS.subjectPrefix} ${subjectName}`,
			text: `Name: ${clean.name}\nEmail: ${clean.email}\n\n${clean.message}`
		};
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), SETTINGS.resendTimeoutMs);
		try {
			const response = await doFetch(SETTINGS.resendUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload),
				signal: controller.signal
			});
			if (!response.ok) {
				console.warn(`contact resend_status_${response.status}`);
				return fail(502, "server");
			}
			return jsonResponse(200, { ok: true });
		} catch {
			console.warn(controller.signal.aborted ? "contact resend_timeout" : "contact resend_network");
			return fail(502, "server");
		} finally {
			clearTimeout(timer);
		}
	}
	return async function handle(request, env) {
		const result = await process(request, env);
		if (result.status !== 200) console.warn(`contact responded ${result.status}`);
		return result;
	};
}
var handleContact = createContactHandler();
//#endregion
//#region server/vercel.ts
var UNKNOWN_IP = "unknown";
var SERVER_ERROR_BODY = JSON.stringify({
	ok: false,
	error: "server"
});
async function handle(request) {
	const headers = {};
	request.headers.forEach((value, key) => {
		headers[key.toLowerCase()] = value;
	});
	const bodyText = request.method.toUpperCase() === "POST" ? await request.text() : "";
	const result = await handleContact({
		method: request.method,
		headers,
		bodyText,
		ip: resolveClientIp(headers, UNKNOWN_IP, false)
	}, process.env);
	return new Response(result.body, {
		status: result.status,
		headers: result.headers
	});
}
var vercel_default = { async fetch(request) {
	try {
		return await handle(request);
	} catch {
		console.warn("contact responded 500");
		return new Response(SERVER_ERROR_BODY, {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
} };
//#endregion
export { vercel_default as default };
