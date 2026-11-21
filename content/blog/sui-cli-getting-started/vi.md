---
title: Bắt đầu với SUI Network qua SUI CLI
date: 2026-11-19
summary: Cài SUI CLI, tạo ví, lấy SUI test và publish smart contract Move đầu tiên lên testnet. Ghi chép từ repo dui14/sui.
tags: [sui, move, web3]
---

Mình bắt đầu học SUI khi làm khoá luận Web3 và ghi lại mọi lệnh vào một repo: [dui14/sui](https://github.com/dui14/sui). Bài này gom lại những lệnh đó theo đúng thứ tự mình dùng: cài CLI, tạo ví, lấy SUI test, rồi build và publish một package Move.

## SUI là gì

SUI là blockchain Layer-1 dùng Proof of Stake. Điểm khác lớn nhất so với Ethereum là **mô hình object**: mọi thứ trên chuỗi (coin, NFT, package) là một object có ID và chủ sở hữu riêng. Giao dịch chỉ đụng tới object của chính mình thì không cần chờ cả mạng sắp thứ tự, nên xác nhận nhanh và phí thấp.

Smart contract trên SUI viết bằng **Move**. Move ra đời ở Meta cho dự án Diem, sau đó SUI dùng một phiên bản riêng xoay quanh object. Tài nguyên trong Move không thể bị sao chép hay vô tình mất đi, nên cả một nhóm lỗi quen thuộc của Solidity bị chặn ngay lúc biên dịch.

## Cài SUI CLI

Có ba cách, chọn một:

**1. Dùng `suiup` (khuyên dùng).** Đây là trình cài chính thức, cho phép giữ nhiều phiên bản theo từng mạng:

```bash
curl -sSfL https://raw.githubusercontent.com/MystenLabs/suiup/main/install.sh | sh
suiup install sui@testnet
```

Trên Windows có thể dùng `choco install sui`, trên macOS dùng `brew install sui`. Chi tiết ở [tài liệu cài đặt chính thức](https://docs.sui.io/guides/developer/getting-started/sui-install).

**2. Build từ source bằng Cargo.** Chậm hơn nhưng chọn đúng nhánh của mạng:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

Đổi `testnet` thành `devnet` hoặc `mainnet` tuỳ mạng bạn cần.

**3. Tải bản release.** Vào [trang Releases](https://github.com/MystenLabs/sui/releases), tải file đúng hệ điều hành, giải nén rồi thêm thư mục vào `PATH`.

Kiểm tra lại:

```bash
sui --version
```

## Ví và địa chỉ

Lần đầu chạy `sui client`, CLI sẽ hỏi mạng muốn kết nối và tự tạo một địa chỉ. Các lệnh hay dùng:

```bash
sui client addresses
sui client active-address
sui client switch --address <địa-chỉ>
```

Tạo thêm ví với scheme và số từ khoá khác nhau:

```bash
sui client new-address ed25519
sui client new-address secp256k1
sui client new-address ed25519 word24
sui client new-address ed25519 word12 "m/44'/784'/0'/0'/0'"
```

| Tham số | Giá trị | Mặc định |
|---|---|---|
| Scheme | `ed25519`, `secp256k1`, `secp256r1` | `ed25519` |
| Số từ khoá | `word12`, `word15`, `word18`, `word21`, `word24` | `word12` |

> Lệnh `sui keytool export --key-identity <địa-chỉ>` in ra **private key**. Đừng chạy lệnh này khi đang chia sẻ màn hình, và đừng dán kết quả vào bất kỳ đâu.

## Mạng lưới

CLI gọi mỗi mạng là một *env*. Xem danh sách và thêm mạng mới:

```bash
sui client envs
sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client new-env --alias mainnet --rpc https://fullnode.mainnet.sui.io:443
sui client switch --env testnet
```

Kiểm tra kỹ alias và URL khớp nhau. Đặt alias `testnet` nhưng trỏ RPC vào mainnet thì mọi giao dịch sau đó tốn tiền thật.

## Lấy SUI test

Publish contract cần gas, nên trước tiên lấy ít SUI miễn phí trên mạng test:

```bash
sui client faucet
```

Trên devnet lệnh này gửi coin thẳng vào ví. Trên testnet, faucet đã chuyển sang web: CLI sẽ in ra đường dẫn [faucet.sui.io](https://faucet.sui.io), bạn dán địa chỉ ví vào đó. Kiểm tra số dư và các object đang có:

```bash
sui client balance
sui client objects
```

## Build và publish package Move

Tạo package mẫu, build và chạy test:

```bash
sui move new hello_sui
cd hello_sui
sui move build
sui move test
```

Publish lên testnet:

```bash
sui client switch --env testnet
sui client publish --gas-budget 100000000
```

Các bản CLI mới tự ước lượng gas, `--gas-budget` chỉ để đặt mức trần (đơn vị MIST, 1 SUI = 10<sup>9</sup> MIST). Kết quả trả về có **Package ID**: lưu lại, vì mọi lời gọi hàm sau này đều cần nó.

Xem lại một giao dịch bất kỳ:

```bash
sui client tx-block <digest>
```

## Thứ tự mình khuyên

1. Cài CLI bằng `suiup`, chạy `sui --version`.
2. Chạy `sui client`, chọn testnet, lưu cụm từ khôi phục ở chỗ an toàn.
3. Lấy SUI test, kiểm tra `sui client balance`.
4. `sui move new`, `build`, `test`, rồi `publish`.
5. Mở Package ID trên [Suiscan](https://suiscan.xyz/testnet) để xem contract vừa lên chuỗi.

Toàn bộ ghi chép gốc vẫn nằm ở [github.com/dui14/sui](https://github.com/dui14/sui). Bài sau mình sẽ viết về object trong Move: owned, shared và immutable khác nhau thế nào khi viết contract.
