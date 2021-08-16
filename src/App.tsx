import React, { useEffect, useState } from "react";
import { Text, FlatList } from "react-native-web";
import { Button } from "react-native-elements";

interface Props {
  jokes: string[];
  loading: string;
}
const JokesContext = React.createContext({} as Props["jokes"]);

function RenderJokes({ item, index }): React.ReactElement {
  return (
      <Text style={{ margin: 10 }} key={Math.random()}>
        {`${index + 1}: ${item.joke}`}
      </Text>
  );
}

export default function App(): React.ReactElement {
  const [init, postInit] = useState<Props>({} as Props);
  async function get_jokes(): Promise<void> {
    postInit({ loading: "Loading jokes for ya" } as Props);
    const joke = await fetch(
      "https://v2.jokeapi.dev/joke/Dark?blacklistFlags=nsfw,racist,sexist&amount=10"
    ).then((res) => res.json());
    const filterWithSetup: any[] = joke.jokes.filter((i) => i.setup);
    const filterWithJokes: any[] = joke.jokes.filter((i) => i.joke);
    const merge = [...filterWithJokes, ...filterWithSetup];
    //@ts-ignore // lib should be es2017 and above

    const jokes: Props["jokes"] = Object.entries(merge).map(([key, val]) => {
      return {
        joke: val.joke ?? val.setup + " .... " + val.delivery
      };
    });
    postInit(
      (prevState) =>
        ({
          ...prevState,
          loading: "",
          jokes
        } as Props)
    );
  }
  useEffect(() => {
    get_jokes();
  }, []);
  return (
    <>
      <JokesContext.Provider value={init.jokes}>
        <Text
          style={
            init.loading
              ? { fontSize: 24, color: "red", alignSelf: "center", margin: 30 }
              : null
          }
        >
          {init.loading}
        </Text>
        <FlatList
          keyExtractor={(id) => id.joke as string}
          data={init.jokes as Props["jokes"]}
          renderItem={({ item, index }) =>
            (<RenderJokes item={item} index={index} />) as React.ReactElement
          }
        />
        <Button
          style={{
            width: "60%",
            height: 30,
            alignSelf: "center",
            marginVertical: 20
          }}
          title={"load another set"}
          onPress={() => {
            postInit({ jokes: [] } as Props);
            get_jokes();
          }}
        />
      </JokesContext.Provider>
    </>
  );
}


function withUID<T>(obj: T) {   
   return Object.assign({}, obj, { uuid: '1234' });  
}