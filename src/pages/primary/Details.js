import { Fragment } from "react";
import Layout from "../Layout";
import Result from "../../components/details/Result";

function Details({ API }) {
    return (
        <Fragment>
            <Layout>
                <Result API={API}/>
            </Layout>
        </Fragment>
        
    );
}

export default Details;
