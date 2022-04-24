let GAME_ENDPOINT, FRONTOFFICE_ENDPOINT, BACKOFFICE_ENDPOINT, API_ENDPOINT;

if (process.env.NODE_ENV == "production") {
  GAME_ENDPOINT = "http://todo.tw.cs.unibo.it/game/";
  FRONTOFFICE_ENDPOINT = "http://todo.tw.cs.unibo.it/front/";
  BACKOFFICE_ENDPOINT = "http://todo.tw.cs.unibo.it/back/";
  API_ENDPOINT = "http://todo.tw.cs.unibo.it/api/";
} else {
  GAME_ENDPOINT = "http://localhost:3000/";
  FRONTOFFICE_ENDPOINT = "http://localhost:4000/";
  BACKOFFICE_ENDPOINT = "http://localhost:5000/";
  API_ENDPOINT = "http://localhost:6000/";
}

export {
  GAME_ENDPOINT,
  FRONTOFFICE_ENDPOINT,
  BACKOFFICE_ENDPOINT,
  API_ENDPOINT,
};
