import React, {useState} from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

const ENDPOINT = 'http://localhost:3001/';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: {
      main: '#f44336',
    },
    type: 'dark'
  },
});

const projects = [
  'cerberus',
  'logentries-leserver',
  'platform-js',
  'shuflr-js',
  'pipr-js',
  'logentries-lemeta',
  'logentries-lehitman',
  'logentries-leabacus'
];

function App() {
  const [ project, setProject ] = useState(null);
  const [ query, setQuery ] = useState('');
  const [ results, setResults ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ submitted, setSubmitted ] = useState({
    project: null,
    query: null
  });

  const submit = e => {
    e.preventDefault();

    setSubmitted({
      project,
      query
    });

    fetch(`${ENDPOINT}${project}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query})
    }).then(response => response.text())
    .then(results => setResults(results))
    .catch(error => setError(error));
  };

  const formatLine = line => {
    try {
      const [_, file, n, match] = /([^:]+):(\d+):\s*(.*)/.exec(line);

      return <a class="real"
        href={`https://github.com/rapid7/${submitted.project}/blob/master/${file}#L${n}}`}><span class="file">{file}</span><span class="line">#{n}</span>: <kbd class="match">{match}</kbd></a>
    } catch (ex) {
      try {
        const [_, file, n, match] = /([^:]+)-(\d+)-\s*(.*)/.exec(line);

        return <a class="context"
          href={`https://github.com/rapid7/${submitted.project}/blob/master/${file}#L${n}}`}><span class="file">{file}</span><span class="line">#{n}</span>: <kbd class="match">{match}</kbd></a>
      } catch (ex2) {
        return line;
      }
    }
  };

  return (
    <main>
      <ThemeProvider theme={theme}>
        <div id="projects">
          <ul>
            {projects.map(name =>
              <li onClick={() => setProject(name)}>{name}</li>)}
          </ul>
        </div>
        <div id="content">
          <div id="search">
            <form onSubmit={submit}>
              <TextField
                className="query"
                type="text"
                value={query}
                minLength="3"
                onChange={e => setQuery(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={submit}>Search</Button>
            </form>
          </div>
          <div id="results">
            {error ? <div class="error">{error}</div> :
              <div class="results">
                <ul>
                  {(results || '').split('\n--\n').map(result =>
                    <li class="result">
                      <ul data-raw={result}>
                        {result.split(/\n+/).filter(x => !!x).map(line =>
                          <li>{formatLine(line)}</li>)}
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
            }
          </div>
        </div>
      </ThemeProvider>
    </main>
  );
}

export default App;
