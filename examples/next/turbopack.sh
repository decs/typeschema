#!/usr/bin/env bash

pnpm next dev --turbo &
sleep 2
curl http://127.0.0.1:3000 -f > /dev/null
status="$?"
kill $!
exit "$status"