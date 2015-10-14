if (!window.localStorage) {
    alert("Please upgrade your browser to support localStorage!");
    window.close();
}
var dir = "/";
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
        return {files: []};                 
    },
    componentWillMount: function () {
        GET("/list?dir=" + escape(dir), (response) => this.setState({files: response}));                  
    },
    render: function () {
        return (React.createElement("div", null, 
            React.createElement("h3", null, "Path: ", dir), 
            React.createElement("button", {onClick: this.back}, "back"), 
            React.createElement("ul", null, this.state.files.map((file, index) => {
                if (!file.isFile) {
                    return React.createElement("li", {key: index}, React.createElement("a", {href: "#", onClick: () => this.update(index)}, file.file))
                } else {
                    return React.createElement("li", {key: index}, file.file);
                }
            }))
        ));
    },
    update: function (index) {
        var file = this.state.files[index].file;
        hist.push(dir);
        dir = dir == "/" ? dir + file : dir + "/" + file;
        GET("/list?dir=" + escape(dir), (response) => this.setState({files: response}));                  
    },
    back: function () {
        if (hist.length == 0) return;
        var dir = hist.pop();
        GET("/list?dir=" + escape(dir), (response) => this.setState({files: response}));                  
    }
});

ReactDOM.render(React.createElement(APP, null), document.getElementById("app"));
