import React, {Component} from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect,
    useParams
} from "react-router-dom";
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Chat from '../pages/Chat';
import Signup from '../pages/SignUp';
import Login from '../pages/Login';
import {auth} from '../firebase/firebase';
import '../style.css';

function PrivateRoute({component: Component, authenticated, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => authenticated === true ?
                (<Component {...props} />) :
                (<Redirect to={{pathname: '/login', state: {from: props.location}}}/>)
            }
        />
    )
}

function PublicRoute({component: Component, authenticated, ...rest}) {
    return (
        <Route
            {...rest}
            render={props =>
                authenticated === false ?
                    (<Component {...props} />)
                    :
                    (<Redirect to="/profile"/>)
            }
        />
    );
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            loading: true,
        };
    }

    componentDidMount() {
        auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    loading: false,
                });
            } else {
                this.setState({
                    authenticated: false,
                    loading: false,
                });
            }
        })
    }

    render(){

        return this.state.loading === true ? <h2>Loading...</h2> : (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <PrivateRoute path="/profile" authenticated={this.state.authenticated} component={Profile} />
                    <PrivateRoute path="/chat/:chatName" authenticated={this.state.authenticated} component={Chat}s/>
                    <PublicRoute path="/signup" authenticated={this.state.authenticated} component={Signup} />
                    <PublicRoute path="/login" authenticated={this.state.authenticated} component={Login} />
                </Switch>
                {/*<Switch>*/}
                {/*    <Route path="/chat/:chatName" children={<Child />} />*/}
                {/*</Switch>*/}
            </Router>
        );
    }
}

function Child() {
    // We can use the `useParams` hook here to access
    // the dynamic pieces of the URL.
    const { chatName } = useParams();

    return (
        <div>
            <h3>ID: {chatName}</h3>
        </div>
    );
}

export default App;


