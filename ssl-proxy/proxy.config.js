module.exports = {
    apps : [{
        name   : "ssl proxy",
        script : "./proxy.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster",
        max_memory_restart: "256M"
    }]
}