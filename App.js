import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Main from "./pages/Main";

const client = new ApolloClient({
  uri: "http://192.168.0.202:3000/api/hello",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Main />
    </ApolloProvider>
  );
}
