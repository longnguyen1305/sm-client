import { Fragment } from "react";
import Layout from "../Layout";
import Project from "../../components/upload/Project";

function Upload({ API }) {
    return (
        <Fragment>
            <Layout>
                <Project API={API}/>
            </Layout>
        </Fragment>
        
    );
}

export default Upload;
