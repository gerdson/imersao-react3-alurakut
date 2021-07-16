import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { useEffect, useState } from 'react';


function ProfileSideBar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />

      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function RelationsBox(props) {
  const listaComOsSeisPrimeirosElementos = props.list.slice(0, 6);
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.name} ({props.list.length})
      </h2>
      <ul>
        {listaComOsSeisPrimeirosElementos.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`/users/${itemAtual.title}`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const usuarioAleatorio = 'gerdson';

  const [comunidades, setComunidades] = useState([{
    id: Math.random(),
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);

  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/rafaballerini/followers')
      .then(resposta => {
        if (resposta.status >= 200 && resposta.status < 300) {
          return resposta.json();
        } else {
          return resposta.json().then(Promise.reject.bind(Promise));
        }
      })
      .then(dados => {
        setSeguidores(dados);
      })
      .catch(erro => {
        console.log('Erro ao buscar os dados na api do github: ', erro.message);
      })
  }, []);

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'guilhermesilveira'
  ];

  function geraObjetosPessoasFavoritasGitHub(usuarios) {
    let objetosUsuarios = [];
    usuarios.forEach(usuario => {
      objetosUsuarios.push({
        id: Math.random(),
        title: usuario,
        image: `https://github.com/${usuario}.png`
      });
    })
    return objetosUsuarios;
  }

  function geraObjetosSeguidoresGitHub(dados) {
    return dados.map(usuario => {
      return {
        id: usuario.id,
        title: usuario.login,
        image: usuario.avatar_url
      };
    })
  }

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem Vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(event) {
              event.preventDefault(); //evita o recarregamento da pagina que eh o comportamento padrao do formulario
              const dadosDoForm = new FormData(event.target);
              const comunidade = {
                id: Math.random(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image')
              }
              setComunidades([...comunidades, comunidade]);
              Array.from(document.querySelectorAll("input")).forEach(
                input => (input.value = "")
              );
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>
                Cria comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <RelationsBox
            name="Seguidores"
            list={geraObjetosSeguidoresGitHub(seguidores)}
          />

          <RelationsBox
            name="Comunidades"
            list={comunidades}
          />

          <RelationsBox
            name="Pessoas da Comunidade"
            list={geraObjetosPessoasFavoritasGitHub(pessoasFavoritas)}
          />

        </div>
      </MainGrid >
    </>
  )
}
