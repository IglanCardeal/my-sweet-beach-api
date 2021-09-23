# <h1 align="center">My Sweet Beach API</h1>

![weather-wallpapper](./docs/weather.png)

## <h3 align="center">API para consulta e previsão do clima em qualquer praia do globo</h3>

## API em construção... :hammer: 👷‍♂️ 👨‍💻

`README.md` completo em breve...

## Tabela de conteúdos

- [Sobre](#sobre)
  - [API Restful](#api)
  - [Projeto front-end](#frontend)
- [Como usar localmente](#como-usar)
  - [Requisitos](#como-usar)
    - [Configurando arquivo `default.json`](#env)
  - [Nao tenho mongodb instalado. E agora?🤔](#atlas)
    - [Atlas](#atlas)
    - [Container Docker](#docker)
- [Tecnologias/ferramentas usadas](#tecnologias)
- [Testes Automatizados](#testes)
- [Autor](#autor)

<p id="atlas"></p>

### Não tem MongoDB instalado?

Sem problemas!

#### Atlas

Você pode inserir uma URI de algum provedor como o [Atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_americas_brazil_search_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=1718986516). Neste caso, vamos definir um URI no campo `mongoUrl`. Esta propriedade do `default.json` tem prioridade, logo se você definiu uma URI, ela será usada, senão deixea vazia por padrão do `default-example.json`.
A URI a ser usada, no caso se você usar o Atlas, terá o formato semelhante a seguir:

```json
{
  "App": {
    "port": 3000,
    "database": {
      "mongoUrl": "mongodb+srv://<username>:<password>@cluster0.zcr3z.mongodb.net/<dbname>?retryWrites=true&w=majority"
    },
    "resources": {
      "StormGlass": {
        "apiUrl": "https://api.stormglass.io/v2",
        "apiToken": ""
      }
    }
  }
}
```

Onde:

- `username`: seu nome de usuário

- `password`: sua senha

- `dbname`: nome da base de dados. Eu recomendo chamar de `email-performance-app`

Tendo realizado todas as configurações, execute `npm run dev` ou `yarn dev` para iniciar a aplicação em modo de **desenvolvimento**(`development`).

**_OBS_**: ao executar o comando para iniciar a aplicação, será exibido no terminal a URI de conexão com o banco.

<p id="docker"></p>

#### Você usa Docker? :whale:

Uma solução alternativa é subir um container do Docker do MongoDB. Existe a [imagem oficial do mongo](https://hub.docker.com/_/mongo) que podemos usar para subir um container MongoDB e usar o banco de dados.
Na raíz do projeto temos um arquivo `docker-compose.yml` com as seguintes características:

```bash
version: '3'

services:
  mongo:
    container_name: weather-forecast-api
    restart: always
    ports:
      - 27017:27017
    image: mongo
    volumes:
      - ./MongoDB:/data/dbc

```

Esse arquivo é a base para gerar um container do mongodb. Na raíz do projeto, execute o comando `docker-compose up` para iniciar o serviço do MongoDB. Faça os ajustes no arquivo `default.json` de acordo com a configuração do container ou deixe o padrão do `default-example.json`.

### Testes Automatizados

<p id="testes"></p>

Foi utilizado o JEST para os criação de testes automatizados. O sistema é coberto por testes de unidade e de integração. Ambos possuem seus próprios arquvivos de configuração (`jest.config.js`) e a nomenclatura possui diferença semântica quanto ao tipo de teste:

- Os **testes de unidade** possuem nomenclatura de arquivo do tipo `*.test.ts`.
- Os **testes de integração**, os arquivos são nomeados com padrão `*.spec.ts`.

A nomenclatura dos arquivos de testes são apenas uma convenção adotada por mim.

### Autor

<p id="autor"></p>

<kbd>
 <img style="border-radius: 50%;" src="https://avatars1.githubusercontent.com/u/37749943?s=460&u=70f3bf022f3a0f28c332b1aa984510910818ef02&v=4" width="100px;" alt="iglan cardeal"/>
</kbd>

<b>Iglan Cardeal</b>

Desenvolvido e mantido por Iglan Cardeal :hammer: </br>
Desenvolvedor NodeJS 💻 <br>
Entre em contato! 👋🏽

- cmtcardeal@outlook.com :email:
- Instagram [@cmtcardeal](https://www.instagram.com/cmtecardeal/)
- StackOverflow [Cmte Cardeal](https://pt.stackoverflow.com/users/95771/cmte-cardeal?tab=profile)

</div>

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
