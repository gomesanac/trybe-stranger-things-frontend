import React from "react";
import CharactersService from "../services/charactersAPI";
require("dotenv").config();

const {
  REACT_APP_HAWKINS_URL,
  REACT_APP_HAWKINS_TIMEOUT,
  REACT_APP_UPSIDEDOWN_URL,
  REACT_APP_UPSIDEDOWN_TIMEOUT,
  REACT_APP_DEV_MODE,
} = process.env;

const getRealityClass = (hereIsTheUpsideDownWorld) =>
  hereIsTheUpsideDownWorld ? "upside-down" : "stranger-things";

const strangerThingsConfig = {
  url: REACT_APP_HAWKINS_URL,
  timeout: REACT_APP_HAWKINS_TIMEOUT,
};

const upsideDownConfig = {
  url: REACT_APP_UPSIDEDOWN_URL,
  timeout: REACT_APP_UPSIDEDOWN_TIMEOUT,
};

const charactersService = new CharactersService(strangerThingsConfig);
const charactersUpsideDownService = new CharactersService(upsideDownConfig);

class StrangerThings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hereIsTheUpsideDownWorld: false,
      characterName: "",
      characters: [],
      page: 1,
    };

    this.handleInput = this.handleInput.bind(this);
    this.changeRealityClick = this.changeRealityClick.bind(this);

    this.searchClick = this.searchClick.bind(this);
    this.searchCharacter = this.searchCharacter.bind(this);

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  changeRealityClick() {
    this.setState({
      hereIsTheUpsideDownWorld: !this.state.hereIsTheUpsideDownWorld,
      characters: [],
    });
  }

  handleInput(event) {
    this.setState({
      characterName: event.target.value,
    });
  }

  searchClick() {
    this.setState(
      {
        page: 1,
      },
      this.searchCharacter(1)
    );
  }

  searchCharacter(page) {
    const service = this.state.hereIsTheUpsideDownWorld
      ? charactersUpsideDownService
      : charactersService;

    service
      .getCharacters(this.state.characterName, page || this.state.page, 10)
      .then(({ data: characters }) => {
        this.setState({
          characters,
        });
      });
  }

  nextPage() {
    if (!this.state.characters.length) return;

    this.setState(
      {
        page: this.state.page + 1,
      },
      () => this.searchCharacter()
    );
  }

  previousPage() {
    if (this.state.page <= 1) return;

    this.setState(
      {
        page: this.state.page - 1,
      },
      () => this.searchCharacter()
    );
  }

  render() {
    return (
      <div
        className={`reality ${getRealityClass(
          this.state.hereIsTheUpsideDownWorld
        )}`}
      >
        <div className="content strangerfy">
          {REACT_APP_DEV_MODE && (
            <div className="desenvolvimento">
              <h2>Em desenvolvimento</h2>
            </div>
          )}

          <div className="change-reality">
            <button onClick={this.changeRealityClick}>
              {" "}
              Mudar de Realidade
            </button>
          </div>

          <div>
            <input
              placeholder="Nome do Personagem"
              onChange={this.handleInput}
              value={this.state.characterName}
            />
            <button onClick={this.searchClick}>Pesquisar</button>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Origem</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {this.state.characters.map((char) => (
                  <tr key={char.name}>
                    <td>{char.name}</td>
                    <td>{char.origin}</td>
                    <td>{char.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <p>P??gina atual: {this.state.page}</p>
          </div>
          <div>
            <button onClick={this.previousPage}>Anterior</button>
            <button onClick={this.nextPage}>Pr??ximo</button>
          </div>
        </div>
      </div>
    );
  }
}

export default StrangerThings;
