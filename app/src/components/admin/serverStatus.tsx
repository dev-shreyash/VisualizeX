"use client";
import { useEffect, useState } from "react";
import axios from "axios";


const ServerStatus = () => {
    const [serverStatus, setServerStatus] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServerStatus = async () => {
          try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/status");
            setServerStatus(response.data.status);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching users:", error);
          } finally {
            setLoading(false);}
        };
    
        fetchServerStatus();
      }, []);

    return(
        <>
        {loading && <div>Loading...</div>}
        {serverStatus === "OK" ? <div>Server Status: <p className="text-green-500">{serverStatus}</p></div> : <div>Server Status: <p className="text-red-500">Not OK</p></div>}
        </>
    )
}

export default ServerStatus;