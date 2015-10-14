if (!window.localStorage) {
    alert("Please upgrade your browser to support localStorage!");
    window.close();
}
var dir = localStorage.getItem("dir") || "/";
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
                return React.createElement("li", null, React.createElement("a", {href: true, onClick: () => this.update(index), key: index}, file.file))
            } else {
                return React.createElement("li", null, file.file);
            }
        }));
    },
    update: function (index) {
        console.log("%s is clicked", index);
        dir = dir + "/" + this.state.files[index];
        localStorage.setItem("dir", dir);
        GET("/list?dir=" + escape(dir), (response) => this.setState({files: response}));                  
    }
});

React.render(React.createElement(APP, null), document.getElementById("app"));
