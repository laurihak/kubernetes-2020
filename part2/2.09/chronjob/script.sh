#!/bin/bash
URL=$(curl  -w "%{redirect_url}" -o /dev/null -s "https://en.wikipedia.org/wiki/Special:Random")


content="read ${URL}"

echo $content

generate_post_data()
{
  cat <<EOF
{
  "type": "type",
  "content": "$content"
}
EOF
}

curl  http://project-backend-svc:2345/todos



curl -H "Content-Type:application/json" --data "$(generate_post_data)" -X POST http://project-backend-svc:2345/todos
