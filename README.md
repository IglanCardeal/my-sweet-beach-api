# <h1 align="center">Storm Glass Weather API</h1>

![weather-wallpapper](./docs/weather.png)

## <h3 align="center">API para consulta e previsão do clima em qualquer lugar do globo</h3>

## API em construção... :hammer: 👷‍♂️ 👨‍💻

`README.md` completo em breve...

## Testes Automatizados

Foi utilizado o JEST para os criação de testes automatizados. O sistema é coberto por testes de unidade e de integração. Ambos possuem seus próprios arquvivos de configuração (`jest.config.js`) e a nomenclatura possui diferença semântica quanto ao tipo de teste:

- Os **testes de unidade** possuem nomenclatura de arquivo do tipo `*.test.ts`.
- Os **testes de integração**, os arquivos são nomeados com padrão `*.spec.ts`.

A nomenclatura dos arquivos de testes são apenas uma convenção adotada por mim.

### cURL

Usando curl para testar uma url:

```bash
curl "https://api.stormglass.io/v2/weather/point?lat=58.7984&lng=17.8081&params=windSpeed" -H "Authorization: API_KEY" | json_pp -json_opt pretty,canonical

```

- [`json_pp`](https://www.unix.com/man-page/osx/1/json_pp/) para formatar a saída do JSON.

### Clean up duplicated packages

```none
yarn -D add yarn-deduplicate

npx yarn-deduplicate yarn.lock
```

You can also add a verification step to your Continuous Integration (CI) pipeline like:

```none
yarn-deduplicate yarn.lock --list --fail
```

```none
```

```none
```