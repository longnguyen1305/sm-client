import { Fragment } from "react";
import Dashboard from "../components/Dashboard";

const Projects = ({ setAuth }) => {
    return (
        <Fragment>
            <div className="container">
                <Dashboard setAuth={setAuth}/>
            </div>
        </Fragment>
        
    );
}

export default Projects;
