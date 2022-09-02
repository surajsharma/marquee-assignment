import axios from "axios";
import { useEffect, useState } from "react";
import PaginatedTable from "./PaginatedTable";
type Props = {};

export default function Table({}: Props) {
    const [companies, setCompanies] = useState([]);
    const [columnDefs] = useState([
        { field: "id" },
        { field: "name" },
        { field: "CIN" }
    ]);
    useEffect(() => {
        console.log("fetch data");

        const getData = async () => {
            const axiosConfig = {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                }
            };

            const res = await axios("/api", axiosConfig);
            console.log(res.data);
            setCompanies(res.data.companies);
        };
        getData();
    }, []);

    return <PaginatedTable data={companies} />;
}
