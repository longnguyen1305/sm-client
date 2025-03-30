import { Fragment } from "react";
import Dashboard from "../components/Dashboard";

const Projects = ({ setAuth, API }) => {
    return (
        <Fragment>
            <div className="container">
                <Dashboard setAuth={setAuth} API={API}/>
            </div>
        </Fragment>
        
    );
}

export default Projects;
