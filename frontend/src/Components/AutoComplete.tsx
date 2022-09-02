import axios from "axios";
import { debounce, replace } from "lodash";
import { FC, useState } from "react";
import List from "./ListItems";
import SearchField from "./SearchField";

import { useNavigate } from "react-router-dom";

const API_URL =
    "https://cors-anywhere.herokuapp.com/https://www.zaubacorp.com/custom-search/";

const DEBOUNCE = 1000;

/**
 * This the search function we need to fetch data from the API using axios
 * Also we need to set the value of isLoading to indicate to the user that the results are being fetched
 * and once the fetching is done we need to set the response data as our search results so they can be consumed by the component
 * @param {*} queryParam the search string
 * @param setResults a function to set update the state of the component with search result
 * @param setIsloading a function to control the loading state
 */

const axiosConfig = {
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
    }
};

const searchFun = (
    queryParam: string,
    setResults: (value: string[]) => void,
    setIsLoading: (value: boolean) => void,
    setItems: (value: { name: string; cin: string }[]) => void,
    setErr: (value: string) => void
) => {
    axios
        .post(
            API_URL,
            {
                search: queryParam,
                filter: "company"
            },
            axiosConfig
        )
        .then(({ data }) => {
            if (data.includes("No Company found")) {
                setIsLoading(false);
                setErr("No company found by that name, try again.");
                return;
            }
            setErr("");

            let parser = new DOMParser();
            let htmlDoc = parser.parseFromString(data, "text/html");
            let nodes = htmlDoc.body.children;
            let items = [];
            let totalItems = 0;

            for (let index = 0; index < 5; index++) {
                try {
                    let str = nodes[index].id.replace("company/", "");
                    let parts = str.split("/");
                    parts[0] = replace(parts[0], /-/g, " ");
                    items.push({ name: parts[0], cin: parts[1] });
                    totalItems++;
                } catch (error) {
                    setErr("Something went wrong,  try again please.");
                    setIsLoading(false);
                    return;
                }
            }

            // const { totalItems, items } = data;
            setIsLoading(false);
            setItems(items);

            //googleBook api return the number of total items, in case it is 0 we need to make sure this checked ,
            // in other apis you might get different type of results where it is always array of strings and we don't have to do this check
            setResults(totalItems ? items.map((i: any) => i.name) : []);
        })
        .catch((err) => {
            console.log(err.message);
            setErr(err.message + ", please refresh the page.");
            setIsLoading(false);
            return;
        });
};

/**
 * This is the debounced function that we will run once the user hit a key
 * lodash debounce return a function, that can be invoked any time
 * this function takes a function, searchFunction, and a debounce time
 * in this way we guarantee that the we only fetch after certin time and we don't spam the api with calls every time the user hits a key
 */
const debouncedSearch = debounce(searchFun, DEBOUNCE);
/**
 * searchFun and debouncedSearch can live outside the component
 * we don't need to assign them whenever the component rerender
 * which in this case on every state change
 * They still can work as fine, but it is simply not necessary
 */

const AutoComplete: FC = () => {
    const [results, setResults] = useState<string[]>([]);
    const [items, setItems] = useState<{ name: string; cin: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selected, setSelectedItem] = useState<{
        name: string;
        cin: string;
    }>();
    const goto = useNavigate();

    const [error, setError] = useState<string>("");

    const onSearch = (v: string) => {
        setSelectedItem(undefined);
        setError("");
        const search = debouncedSearch;
        if (!v) {
            // when the user clear the field we don't want to perform a search, we need to clear the state and do nothing else
            debouncedSearch.cancel();
            setResults([]);
            setItems([]);
            setIsLoading(false);
        } else {
            setIsLoading(true);
            search(v, setResults, setIsLoading, setItems, setError);
        }
    };

    const submitCompany = async () => {
        await axios
            .post(
                "/api",
                {
                    name: selected?.name,
                    cin: selected?.cin
                },
                axiosConfig
            )
            .then(({ data }) => {
                console.log(data);
            })
            .catch((err) => console.log(err));

        goto("/table");
    };

    return (
        <>
            <>
                {
                    <div className="w-50">
                        {selected && error == "" && (
                            <pre>
                                Company Name: {selected?.name}
                                <br />
                                CIN:{selected && selected?.cin}
                            </pre>
                        )}
                    </div>
                }
            </>
            <div className="d-flex flex-column w-100 justify-content-md-center align-items-center">
                <SearchField onSearch={onSearch} isLoading={isLoading} />
                {!!results.length && (
                    <List
                        items={results}
                        onSelect={(i) => {
                            let s = items.filter((it) => it.name === i);
                            setSelectedItem(s[0]);
                            setResults([]);
                        }}
                    />
                )}
            </div>
            {error ? (
                <p className="mt-5 text-danger">{error}</p>
            ) : (
                <button
                    type="button"
                    className="m-5 w-25 btn btn-primary"
                    disabled={selected?.name == undefined || error !== ""}
                    onClick={submitCompany}
                >
                    Submit
                </button>
            )}
        </>
    );
};

export default AutoComplete;
