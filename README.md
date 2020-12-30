# http-client

> Customizable React http client library

[![NPM](https://img.shields.io/npm/v/http-client.svg)](https://www.npmjs.com/package/http-client) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save http-client
```

## Usage
```jsx
export default function App() {
	const [todos, setTodos] = useState([]);
	
	const todosAPI = useAPI("GET", "/todos");
	
	const fetchTodos = useCallback(() => {
		todosAPI.call();
	},  [todosAPI, params]);
	
	useEffect(() => {
		fetchTodos();
	}, []);
	
	useEffect(() => {
		if(todosAPI.networkState === 'success' && todosAPI.body) {
			setTodos(todosAPI.body);
		}
	}, [todosAPI.body, todosAPI.networkState]);
	
	return (
		<div>
			{todosAPI.loading && <div>Loading...</div>}
			{
				!todosAPI.loading && todosAPI.networkState === "success" && (
					<div>
						{todos.map((item) => (<div key={item.id}>{item.title}</div>))}
					</div>
				)
			}
			{!todosAPI.loading && todosAPI.networkState === "error" && (<div>Error fetching todos</div>)}
		</div>
	);
}
```

See more advanced demo on [codesandbox](https://codesandbox.io/s/fracto-http-client-sample-kr95m)

## License

MIT © [https://github.com/fracto-team](https://github.com/https://github.com/fracto-team)
