
timestamps = []
paystubs = []


function add(vals, a, b) {
    var result = 0
    for (var i = a - 1; i < b; i++) {
        result += vals[i]
    }
    return result;
}

function knapsack(points, group_length, num_groups) {
    // Profit matrix
    var m = [];
    for (var x = 0; x < num_groups + 1; x++) {
        m.push(Array.apply(null, Array(points.length + 1)).map(Number.prototype.valueOf, 0));
    }

    // Timestamp matrix so we can track how we got the best answer
    var ts = []
    for (var x = 0; x < num_groups + 1; x++) {
        ts.push([]);
    }

    // Initialize base cases
    for (var j = 0; j < points.length + 1; j++) {
        ts[0].push([])
    }
    for (var j = 1; j < ts.length; j++) {
        ts[j].push([])
    }

    // Main loops
    for (var n = 1; n < num_groups + 1; n++) {
        for (var i = 1; i < points.length + 1; i++) {
            if (i >= group_length) {
                sum = add(points, i - group_length + 1, i)

                // Is including new pt more profitable?
                if (m[n - 1][i - group_length] + sum > m[n][i - 1]) {
                    newTup = [i - group_length + 1, i]
                    newList = ts[n - 1][i - group_length]
                    newList.push(newTup)
                    ts[n].push(newList)
                    m[n][i] = m[n - 1][i - group_length] + sum
                }
                // Base case is better than new point
                else {
                    m[n][i] = m[n][i - 1]
                    var size = ts[n].length
                    ts[n].push(ts[n][size - 1])
                }
            }
            // Start an empty list base case we can refer to in a later iteration
            else {
                emptyList = []
                ts[n].push(emptyList)
            }
        }
    }
    return [ts[num_groups][points.length], m[num_groups][points.length]]
}


function run(group_sizeIn,num_groupsIn) {
    var start = new Date().getTime();

    group_size = group_sizeIn;
    num_groups = num_groupsIn;
    var results = knapsack(paystubs, group_size, num_groups)
    var end = new Date().getTime();

    var resultOutput = []

    resultOutput.push("Average of " + num_groups + " chosen groups: " + (results[1] / num_groups));
    resultOutput.push("Optimal date ranges:")

    for (var valIdx = 0; valIdx < results[0].length; valIdx++) {
        var val = results[0][valIdx];
        resultOutput.push("&nbsp&nbsp&nbsp&nbsp&nbsp[" + timestamps[val[0] - 1] + " - " + timestamps[val[1] - 1] + "]");
    }

    resultOutput.push("<br>Operation took " + (end-start) + "ms")

    return resultOutput.join("<br>")
}


