module.exports = {
    apps : [{
        name   : "sc server proxy",
        script : "./proxy.js",
        out_file: "/dev/null",
        error_file: "/dev/null",
        exec_mode : "cluster",
        max_memory_restart: "128M"
    }]
}