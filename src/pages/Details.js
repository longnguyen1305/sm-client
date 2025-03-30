import { Fragment } from "react";
import Result from "../components/Result";

function Details({ API }) {
    return (
        <Fragment>
            <div className="container">
                <Result API={API}/>
            </div>
        </Fragment>
        
    );
}

export default Details;
