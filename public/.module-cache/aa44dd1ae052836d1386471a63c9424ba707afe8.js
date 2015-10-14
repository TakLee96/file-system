if (!window.localStorage) {
    alert("Please upgrade your browser to support localStorage!");
    window.close();
}
var hist = [];
var GET = (url, cb) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            cb && cb(xhr.response);
        }
    };
    xhr.responseType = "json";
    xhr.open('GET', url);
    xhr.send();
};

var APP = React.createClass({displayName: "APP",
    getInitialState: function () {
        return {directories: [], files: [], dir: "/"};                 
    },
    componentWillMount: function () {
        GET("/list?dir=" + escape(this.state.dir), (response) => this.setState({files: response.files, directories: response.directories}));                  
    },
    render: function () {
        return (React.createElement("div", null, 
            React.createElement("h3", null, "Path: ", this.state.dir), 
            React.createElement("button", {onClick: this.back}, "back"), 
            React.createElement("h4", null, "Directories"), 
            React.createElement("ul", null, this.state.directories.map((file, index) => {
                return React.createElement("li", {key: "d"+index}, React.createElement("a", {href: "#", onClick: () => this.update(index)}, file))
            })), 
            React.createElement("h4", null, "Files"), 
            React.createElement("ul", null, this.state.files.map((file, index) => {
                return React.createElement("li", {key: "f"+index}, file);
            }))
        ));
    },
    update: function (index) {
        var file = this.state.files[index].file;
        var dir = this.state.dir;
        hist.push(dir);
        dir = dir == "/" ? dir + file : dir + "/" + file;
        GET("/list?dir=" + escape(dir), (response) => this.setState({files: response.files, directories: response.directories, dir: dir}));                  
    },
    back: function () {
        if (hist.length == 0) return;
        var dir = hist.pop();
        GET("/list?dir=" + escape(dir), (response) => this.setState({files: response.files, directories: response.directories, dir: dir}));                  
    }
});

ReactDOM.render(React.createElement(APP, null), document.getElementById("app"));
