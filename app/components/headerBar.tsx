import { AppBar, Typography } from "@material-ui/core";

import React from "react";

export class HeaderBar extends React.Component<{}, {}>{

    public styles = {
        header: {
            padding: "1em 2em",
            marginBottom: "1em",
            display: "flex",
            flexFlow: "row nowrap",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundImage: "linear-gradient(to bottom right, #227F7E, #5bc399",
        },
    };

    public render() {
        return <AppBar color="secondary" style={this.styles.header}>
            <Typography
                variant="title"
            >
                <a href="https://github.com/atomist/microgrammar">Microgrammar</a> Explorer
        </Typography>
            <img src="https://atomist.com/img/Atomist-Logo-White-Horiz.png" style={{ width: "15%", height: "50%" }}></img>
        </AppBar>
    }
}