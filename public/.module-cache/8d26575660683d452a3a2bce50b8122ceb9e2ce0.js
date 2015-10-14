if (!window.localStorage) {
    alert("Please upgrade your browser to support localStorage!");
    window.close();
}
var dir = "/";
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
        return React.createElement("ul", null, this.state.files.map((file, index) => {
            if (!file.isFile) {
                return React.createElement("li", {key: index}, React.createElement("a", {onClick: () => this.update(index)}, file.file))
            } else {
                return React.createElement("li", {key: index}, file.file);
            }
        }));
    },
    update: function (index) {
        var file = this.state.files[index];
        console.log("%s:%s is clicked", index, file);
        dir = dir == "/" ? dir + file : dir + "/" + file;
        GET("/list?dir=" + escape(dir), (response) => this.setState({files: response}));                  
    }
});

ReactDOM.render(React.createElement(APP, null), document.getElementById("app"));
