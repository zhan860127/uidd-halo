curl -X POST \
--data-binary @'out.flac' \
--header 'Content-Type: audio/x-flac; rate=44100;' \
'https://www.google.com/speech-api/v2/recognize?output=json&lang=zh-TW&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw'