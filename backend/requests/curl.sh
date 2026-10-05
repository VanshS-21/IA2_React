#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${BASE_URL:-http://localhost:5000/api}"
LOGIN=$(curl -sS -X POST "$BASE_URL/auth/login" -H 'Content-Type: application/json' -d '{"email":"librarian@shelflife.test","password":"Passw0rd!"}')
TOKEN=$(node -e "console.log(JSON.parse(process.argv[1]).data.token)" "$LOGIN")
AUTH=(-H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json')
curl -sS "$BASE_URL/health"
curl -sS "$BASE_URL/books?limit=5&search=Dune"
curl -sS "$BASE_URL/books/genres"
STAMP=$(date +%s)
BOOK=$(curl -sS -X POST "$BASE_URL/books" "${AUTH[@]}" -d "{\"title\":\"Demo Book $STAMP\",\"author\":\"ShelfLife\",\"isbn\":\"9780306406157\",\"genre\":\"Demo\",\"totalCopies\":2}")
MEMBER=$(curl -sS -X POST "$BASE_URL/members" "${AUTH[@]}" -d "{\"name\":\"Demo Member\",\"email\":\"demo.$STAMP@example.test\"}")
BOOK_ID=$(node -e "console.log(JSON.parse(process.argv[1]).data._id)" "$BOOK")
MEMBER_ID=$(node -e "console.log(JSON.parse(process.argv[1]).data._id)" "$MEMBER")
curl -sS "$BASE_URL/members?limit=1" "${AUTH[@]}"
ISSUED=$(curl -sS -X POST "$BASE_URL/borrow" "${AUTH[@]}" -d "{\"bookId\":\"$BOOK_ID\",\"memberId\":\"$MEMBER_ID\"}")
BORROW_ID=$(node -e "console.log(JSON.parse(process.argv[1]).data.borrowRecord._id)" "$ISSUED")
curl -sS "$BASE_URL/members/$MEMBER_ID/history" "${AUTH[@]}"
curl -sS -X POST "$BASE_URL/borrow/return/$BORROW_ID" "${AUTH[@]}"
ONE_COPY=$(curl -sS -X POST "$BASE_URL/books" "${AUTH[@]}" -d "{\"title\":\"Only One $STAMP\",\"author\":\"ShelfLife\",\"isbn\":\"9780131103627\",\"genre\":\"Demo\",\"totalCopies\":1}")
ONE_COPY_ID=$(node -e "console.log(JSON.parse(process.argv[1]).data._id)" "$ONE_COPY")
curl -sS -X POST "$BASE_URL/borrow" "${AUTH[@]}" -d "{\"bookId\":\"$ONE_COPY_ID\",\"memberId\":\"$MEMBER_ID\"}"
echo "Expected 409 unavailable-copy response:"
curl -sS -X POST "$BASE_URL/borrow" "${AUTH[@]}" -d "{\"bookId\":\"$ONE_COPY_ID\",\"memberId\":\"$MEMBER_ID\"}"
