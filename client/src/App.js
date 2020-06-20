import React from "react"
import { HashRouter, Switch, Route, Link } from "react-router-dom"
import { Layout, Menu } from "antd"
import Dahsboard from "./Dashboard"
import UploadFile from "./UploadFile"
import "antd/dist/antd.min.css"
import "./App.scss"
const { Header, Content } = Layout

function App() {
    return (
        <HashRouter>
            <Header>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                >
                    <Menu.Item key="1">
                        <Link to="/">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/upload">Uplolad</Link>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content>
                <div className="App">
                    <Switch>
                        <Route path="/upload">
                            <UploadFile />
                        </Route>
                        <Route path="/">
                            <Dahsboard />
                        </Route>
                    </Switch>
                </div>
            </Content>
        </HashRouter>
    )
}

export default App
