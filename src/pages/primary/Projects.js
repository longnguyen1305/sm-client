import { Fragment } from "react";
import Layout from "../Layout";
import Dashboard from "../../components/projects/Dashboard";

const Projects = ({ setAuth, API }) => {
    return (
        <Fragment>
            <Layout>
                <Dashboard setAuth={setAuth} API={API}/>
            </Layout>
        </Fragment>
    );
}

export default Projects;
