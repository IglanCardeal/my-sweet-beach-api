# cURL

Usando curl para testar uma url:

```bash
curl "https://api.stormglass.io/v2/weather/point?lat=58.7984&lng=17.8081&params=windSpeed" -H "Authorization: API_KEY" | json_pp -json_opt pretty,canonical

```

- [`json_pp`](https://www.unix.com/man-page/osx/1/json_pp/) para formatar a saída do JSON.
