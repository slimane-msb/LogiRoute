function getDistance(point1, point2) {
  const R = 6371e3;
  const lat1 = point1.lat;
  const lon1 = point1.lng || point1.lng;
  const lat2 = point2.lat;
  const lon2 = point2.lng || point2.lng;
  if (lon1 === void 0 || lon2 === void 0) {
    throw new Error("Points must have lng or lon property");
  }
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function findNearestNode(point, nodes) {
  let nearest = null;
  let minDist = Infinity;
  Object.values(nodes).forEach((node) => {
    const dist = getDistance(
      { lat: point.lat, lng: point.lng ?? point.lng ?? 0 },
      { lat: node.lat, lng: node.lng }
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  });
  return nearest;
}
function processGraphData(nodesRaw, edgesRaw, adjacencyRaw) {
  const nodes = {};
  nodesRaw.forEach((n) => {
    nodes[n.id.toString()] = { id: n.id.toString(), lat: n.lat, lng: n.lng };
  });
  const edges = edgesRaw.map((e) => ({
    from: e.from_node_id.toString(),
    to: e.to_node_id.toString(),
    distance: e.distance
  }));
  const adjacency = {};
  for (const fromId in adjacencyRaw) {
    adjacency[fromId] = adjacencyRaw[fromId].map((e) => ({
      from: fromId,
      to: e.to.toString(),
      distance: e.distance
    }));
  }
  return { nodes, edges, adjacency };
}
function loadGraph(nodesFilePath, edgesFilePath, adjacencyFilePath) {
  const fs = require("fs");
  const path = require("path");
  const nodesRaw = JSON.parse(
    fs.readFileSync(path.resolve(nodesFilePath), "utf-8")
  );
  const edgesRaw = JSON.parse(
    fs.readFileSync(path.resolve(edgesFilePath), "utf-8")
  );
  const adjacencyRaw = JSON.parse(
    fs.readFileSync(path.resolve(adjacencyFilePath), "utf-8")
  );
  return processGraphData(nodesRaw, edgesRaw, adjacencyRaw);
}
function load_city_graph(city) {
  const allowedCities = ["dublin", "paris"];
  if (!allowedCities.includes(city)) {
    throw new Error(`City must be one of ${allowedCities.join(", ")}`);
  }
  return loadGraph(
    `./data/${city}_nodes.json`,
    `./data/${city}_edges.json`,
    `./data/${city}_adjacency.json`
  );
}
async function loadGraphAsync(nodesFilePath, edgesFilePath, adjacencyFilePath) {
  const [nodesResponse, edgesResponse, adjacencyResponse] = await Promise.all([
    fetch(nodesFilePath),
    fetch(edgesFilePath),
    fetch(adjacencyFilePath)
  ]);
  const nodesRaw = await nodesResponse.json();
  const edgesRaw = await edgesResponse.json();
  const adjacencyRaw = await adjacencyResponse.json();
  return processGraphData(nodesRaw, edgesRaw, adjacencyRaw);
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var heap$2 = { exports: {} };
var heap$1 = heap$2.exports;
var hasRequiredHeap$1;
function requireHeap$1() {
  if (hasRequiredHeap$1) return heap$2.exports;
  hasRequiredHeap$1 = 1;
  (function(module, exports$1) {
    (function() {
      var Heap2, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;
      floor = Math.floor, min = Math.min;
      defaultCmp = function(x, y) {
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      };
      insort = function(a, x, lo, hi, cmp) {
        var mid;
        if (lo == null) {
          lo = 0;
        }
        if (cmp == null) {
          cmp = defaultCmp;
        }
        if (lo < 0) {
          throw new Error("lo must be non-negative");
        }
        if (hi == null) {
          hi = a.length;
        }
        while (lo < hi) {
          mid = floor((lo + hi) / 2);
          if (cmp(x, a[mid]) < 0) {
            hi = mid;
          } else {
            lo = mid + 1;
          }
        }
        return [].splice.apply(a, [lo, lo - lo].concat(x)), x;
      };
      heappush = function(array, item, cmp) {
        if (cmp == null) {
          cmp = defaultCmp;
        }
        array.push(item);
        return _siftdown(array, 0, array.length - 1, cmp);
      };
      heappop = function(array, cmp) {
        var lastelt, returnitem;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        lastelt = array.pop();
        if (array.length) {
          returnitem = array[0];
          array[0] = lastelt;
          _siftup(array, 0, cmp);
        } else {
          returnitem = lastelt;
        }
        return returnitem;
      };
      heapreplace = function(array, item, cmp) {
        var returnitem;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        returnitem = array[0];
        array[0] = item;
        _siftup(array, 0, cmp);
        return returnitem;
      };
      heappushpop = function(array, item, cmp) {
        var _ref;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        if (array.length && cmp(array[0], item) < 0) {
          _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
          _siftup(array, 0, cmp);
        }
        return item;
      };
      heapify = function(array, cmp) {
        var i, _i, _len, _ref1, _results, _results1;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        _ref1 = (function() {
          _results1 = [];
          for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--) {
            _results1.push(_j);
          }
          return _results1;
        }).apply(this).reverse();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          _results.push(_siftup(array, i, cmp));
        }
        return _results;
      };
      updateItem = function(array, item, cmp) {
        var pos;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        pos = array.indexOf(item);
        if (pos === -1) {
          return;
        }
        _siftdown(array, 0, pos, cmp);
        return _siftup(array, pos, cmp);
      };
      nlargest = function(array, n, cmp) {
        var elem, result, _i, _len, _ref;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        result = array.slice(0, n);
        if (!result.length) {
          return result;
        }
        heapify(result, cmp);
        _ref = array.slice(n);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          heappushpop(result, elem, cmp);
        }
        return result.sort(cmp).reverse();
      };
      nsmallest = function(array, n, cmp) {
        var elem, los, result, _i, _j, _len, _ref, _ref1, _results;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        if (n * 10 <= array.length) {
          result = array.slice(0, n).sort(cmp);
          if (!result.length) {
            return result;
          }
          los = result[result.length - 1];
          _ref = array.slice(n);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            elem = _ref[_i];
            if (cmp(elem, los) < 0) {
              insort(result, elem, 0, null, cmp);
              result.pop();
              los = result[result.length - 1];
            }
          }
          return result;
        }
        heapify(array, cmp);
        _results = [];
        for (_j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; 0 <= _ref1 ? ++_j : --_j) {
          _results.push(heappop(array, cmp));
        }
        return _results;
      };
      _siftdown = function(array, startpos, pos, cmp) {
        var newitem, parent, parentpos;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        newitem = array[pos];
        while (pos > startpos) {
          parentpos = pos - 1 >> 1;
          parent = array[parentpos];
          if (cmp(newitem, parent) < 0) {
            array[pos] = parent;
            pos = parentpos;
            continue;
          }
          break;
        }
        return array[pos] = newitem;
      };
      _siftup = function(array, pos, cmp) {
        var childpos, endpos, newitem, rightpos, startpos;
        if (cmp == null) {
          cmp = defaultCmp;
        }
        endpos = array.length;
        startpos = pos;
        newitem = array[pos];
        childpos = 2 * pos + 1;
        while (childpos < endpos) {
          rightpos = childpos + 1;
          if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
            childpos = rightpos;
          }
          array[pos] = array[childpos];
          pos = childpos;
          childpos = 2 * pos + 1;
        }
        array[pos] = newitem;
        return _siftdown(array, startpos, pos, cmp);
      };
      Heap2 = (function() {
        Heap3.push = heappush;
        Heap3.pop = heappop;
        Heap3.replace = heapreplace;
        Heap3.pushpop = heappushpop;
        Heap3.heapify = heapify;
        Heap3.updateItem = updateItem;
        Heap3.nlargest = nlargest;
        Heap3.nsmallest = nsmallest;
        function Heap3(cmp) {
          this.cmp = cmp != null ? cmp : defaultCmp;
          this.nodes = [];
        }
        Heap3.prototype.push = function(x) {
          return heappush(this.nodes, x, this.cmp);
        };
        Heap3.prototype.pop = function() {
          return heappop(this.nodes, this.cmp);
        };
        Heap3.prototype.peek = function() {
          return this.nodes[0];
        };
        Heap3.prototype.contains = function(x) {
          return this.nodes.indexOf(x) !== -1;
        };
        Heap3.prototype.replace = function(x) {
          return heapreplace(this.nodes, x, this.cmp);
        };
        Heap3.prototype.pushpop = function(x) {
          return heappushpop(this.nodes, x, this.cmp);
        };
        Heap3.prototype.heapify = function() {
          return heapify(this.nodes, this.cmp);
        };
        Heap3.prototype.updateItem = function(x) {
          return updateItem(this.nodes, x, this.cmp);
        };
        Heap3.prototype.clear = function() {
          return this.nodes = [];
        };
        Heap3.prototype.empty = function() {
          return this.nodes.length === 0;
        };
        Heap3.prototype.size = function() {
          return this.nodes.length;
        };
        Heap3.prototype.clone = function() {
          var heap2;
          heap2 = new Heap3();
          heap2.nodes = this.nodes.slice(0);
          return heap2;
        };
        Heap3.prototype.toArray = function() {
          return this.nodes.slice(0);
        };
        Heap3.prototype.insert = Heap3.prototype.push;
        Heap3.prototype.top = Heap3.prototype.peek;
        Heap3.prototype.front = Heap3.prototype.peek;
        Heap3.prototype.has = Heap3.prototype.contains;
        Heap3.prototype.copy = Heap3.prototype.clone;
        return Heap3;
      })();
      (function(root, factory) {
        {
          return module.exports = factory();
        }
      })(this, function() {
        return Heap2;
      });
    }).call(heap$1);
  })(heap$2);
  return heap$2.exports;
}
var heap;
var hasRequiredHeap;
function requireHeap() {
  if (hasRequiredHeap) return heap;
  hasRequiredHeap = 1;
  heap = requireHeap$1();
  return heap;
}
var heapExports = requireHeap();
const Heap = /* @__PURE__ */ getDefaultExportFromCjs(heapExports);
function dijkstraHeap(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = /* @__PURE__ */ new Set();
  for (const nodeId in graph.nodes) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  }
  distances[start] = 0;
  const heap2 = new Heap((a, b) => a.dist - b.dist);
  heap2.push({ id: start, dist: 0 });
  while (!heap2.empty()) {
    const { id: currentNode, dist } = heap2.pop();
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);
    if (currentNode === end) break;
    for (const edge of graph.adjacency[currentNode] || []) {
      const neighbor = edge.to;
      const newDist = distances[currentNode] + edge.distance;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = currentNode;
        heap2.push({ id: neighbor, dist: newDist });
      }
    }
  }
  const path = [];
  let node = end;
  if (distances[end] === Infinity) return { distance: Infinity, path: [] };
  while (node) {
    path.unshift(node);
    node = previous[node];
  }
  return { distance: distances[end], path };
}
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const visited = /* @__PURE__ */ new Set();
  for (const nodeId in graph.nodes) {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  }
  distances[start] = 0;
  while (visited.size < Object.keys(graph.nodes).length) {
    let currentNode = null;
    let minDist = Infinity;
    for (const nodeId in distances) {
      if (!visited.has(nodeId) && distances[nodeId] < minDist) {
        minDist = distances[nodeId];
        currentNode = nodeId;
      }
    }
    if (!currentNode) break;
    if (currentNode === end) break;
    visited.add(currentNode);
    for (const edge of graph.adjacency[currentNode] || []) {
      const neighbor = edge.to;
      const newDist = distances[currentNode] + edge.distance;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = currentNode;
      }
    }
  }
  const path = [];
  let node = end;
  if (distances[end] === Infinity) {
    return { distance: Infinity, path: [] };
  }
  while (node) {
    path.unshift(node);
    node = previous[node];
  }
  return { distance: distances[end], path };
}
function astar(graph, start, end) {
  const gScore = {};
  const fScore = {};
  const previous = {};
  const visited = /* @__PURE__ */ new Set();
  for (const nodeId in graph.nodes) {
    gScore[nodeId] = Infinity;
    fScore[nodeId] = Infinity;
    previous[nodeId] = null;
  }
  gScore[start] = 0;
  const endNode = graph.nodes[end];
  const startNode = graph.nodes[start];
  fScore[start] = getDistance(
    startNode,
    endNode
  );
  const openSet = new Heap(
    (a, b) => a.f - b.f
  );
  openSet.push({ id: start, f: fScore[start] });
  while (!openSet.empty()) {
    const { id: current } = openSet.pop();
    if (visited.has(current)) continue;
    if (current === end) break;
    visited.add(current);
    for (const edge of graph.adjacency[current] || []) {
      const neighbor = edge.to;
      const tentativeG = gScore[current] + edge.distance;
      if (tentativeG < gScore[neighbor]) {
        gScore[neighbor] = tentativeG;
        previous[neighbor] = current;
        const neighborNode = graph.nodes[neighbor];
        fScore[neighbor] = tentativeG + getDistance(
          neighborNode,
          endNode
        );
        openSet.push({ id: neighbor, f: fScore[neighbor] });
      }
    }
  }
  if (gScore[end] === Infinity) {
    return { distance: Infinity, path: [] };
  }
  const path = [];
  let node = end;
  while (node) {
    path.unshift(node);
    node = previous[node];
  }
  return { distance: gScore[end], path };
}
function greedyBestFirstSearch(graph, start, end) {
  const visited = /* @__PURE__ */ new Set();
  const previous = {};
  const distance = {};
  for (const nodeId in graph.nodes) {
    previous[nodeId] = null;
    distance[nodeId] = Infinity;
  }
  distance[start] = 0;
  const endNode = graph.nodes[end];
  const openSet = new Heap(
    (a, b) => a.h - b.h
  );
  const startNode = graph.nodes[start];
  openSet.push({
    id: start,
    h: getDistance(
      startNode,
      endNode
    )
  });
  while (!openSet.empty()) {
    const { id: current } = openSet.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    if (current === end) break;
    for (const edge of graph.adjacency[current] || []) {
      const neighbor = edge.to;
      if (visited.has(neighbor)) continue;
      const newDist = distance[current] + edge.distance;
      if (newDist < distance[neighbor]) {
        distance[neighbor] = newDist;
        previous[neighbor] = current;
        const neighborNode = graph.nodes[neighbor];
        openSet.push({
          id: neighbor,
          h: getDistance(
            neighborNode,
            endNode
          )
        });
      }
    }
  }
  if (distance[end] === Infinity) {
    return { distance: Infinity, path: [] };
  }
  const path = [];
  let node = end;
  while (node) {
    path.unshift(node);
    node = previous[node];
  }
  return { distance: distance[end], path };
}
function shortestPath(graph, start, end) {
  return astar(graph, start, end);
}
function tourDistance$4(order, dist) {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]][order[i + 1]];
  }
  return total;
}
function greedyInsertionTSP(graph, targets, shortestPathFunc) {
  const n = targets.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const paths = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const res = shortestPathFunc(graph, targets[i], targets[j]);
      dist[i][j] = res.distance;
      paths[i][j] = res.path;
    }
  }
  const order = [0, 1];
  const unvisited = /* @__PURE__ */ new Set();
  for (let i = 2; i < n; i++) unvisited.add(i);
  while (unvisited.size > 0) {
    let bestIncrease = Infinity;
    let bestNode = -1;
    let bestPosition = -1;
    for (const node of unvisited) {
      for (let pos = 0; pos < order.length; pos++) {
        const nextPos = (pos + 1) % order.length;
        const increase = dist[order[pos]][node] + dist[node][order[nextPos]] - dist[order[pos]][order[nextPos]];
        if (increase < bestIncrease) {
          bestIncrease = increase;
          bestNode = node;
          bestPosition = nextPos;
        }
      }
    }
    order.splice(bestPosition, 0, bestNode);
    unvisited.delete(bestNode);
  }
  const fullPath = [];
  for (let i = 0; i < order.length - 1; i++) {
    const a = order[i];
    const b = order[i + 1];
    const segment = paths[a][b];
    if (i === 0) {
      fullPath.push(...segment);
    } else {
      fullPath.push(...segment.slice(1));
    }
  }
  const resultOrder = order.map((i) => targets[i]);
  const distance = tourDistance$4(order, dist);
  return { order: resultOrder, path: fullPath, distance };
}
function heldKarpTSP(graph, targets, shortestPath2) {
  const n = targets.length;
  const dist = Array.from(
    { length: n },
    () => Array(n).fill(Infinity)
  );
  const paths = Array.from(
    { length: n },
    () => Array.from({ length: n }, () => [])
  );
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const res = shortestPath2(graph, targets[i], targets[j]);
      dist[i][j] = res.distance;
      paths[i][j] = res.path;
    }
  }
  const size = 1 << n;
  const dp = Array.from(
    { length: size },
    () => Array(n).fill(Infinity)
  );
  const parent = Array.from(
    { length: size },
    () => Array(n).fill(-1)
  );
  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = 0;
  }
  for (let mask2 = 1; mask2 < size; mask2++) {
    for (let i = 0; i < n; i++) {
      if (!(mask2 & 1 << i)) continue;
      const prevMask = mask2 ^ 1 << i;
      if (prevMask === 0) continue;
      for (let j = 0; j < n; j++) {
        if (!(prevMask & 1 << j)) continue;
        const candidate = dp[prevMask][j] + dist[j][i];
        if (candidate < dp[mask2][i]) {
          dp[mask2][i] = candidate;
          parent[mask2][i] = j;
        }
      }
    }
  }
  const fullMask = size - 1;
  let bestCost = Infinity;
  let last = -1;
  for (let i = 0; i < n; i++) {
    if (dp[fullMask][i] < bestCost) {
      bestCost = dp[fullMask][i];
      last = i;
    }
  }
  const orderIdx = [];
  let mask = fullMask;
  let curr = last;
  while (curr !== -1) {
    orderIdx.push(curr);
    const p = parent[mask][curr];
    mask ^= 1 << curr;
    curr = p;
  }
  orderIdx.reverse();
  const order = orderIdx.map((i) => targets[i]);
  const fullPath = [];
  for (let i = 0; i < orderIdx.length - 1; i++) {
    const a = orderIdx[i];
    const b = orderIdx[i + 1];
    const segment = paths[a][b];
    if (i === 0) {
      fullPath.push(...segment);
    } else {
      fullPath.push(...segment.slice(1));
    }
  }
  return {
    order,
    path: fullPath,
    distance: bestCost
  };
}
function twoOptSwap$2(order, i, k) {
  return order.slice(0, i).concat(order.slice(i, k + 1).reverse(), order.slice(k + 1));
}
function tourDistance$3(order, dist) {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]][order[i + 1]];
  }
  return total;
}
function linKernighanTSP(graph, targets, shortestPathFunc) {
  const n = targets.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const paths = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const res = shortestPathFunc(graph, targets[i], targets[j]);
      dist[i][j] = res.distance;
      paths[i][j] = res.path;
    }
  }
  const order = [];
  const visited = /* @__PURE__ */ new Set();
  let current = 0;
  order.push(current);
  visited.add(current);
  while (order.length < n) {
    let nearest = -1;
    let nearestDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && dist[current][i] < nearestDist) {
        nearest = i;
        nearestDist = dist[current][i];
      }
    }
    current = nearest;
    order.push(current);
    visited.add(current);
  }
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        const newOrder = twoOptSwap$2(order, i, k);
        if (tourDistance$3(newOrder, dist) < tourDistance$3(order, dist)) {
          order.splice(0, order.length, ...newOrder);
          improved = true;
        }
      }
    }
    for (let i = 0; i < n - 2; i++) {
      for (let j = i + 1; j < n - 1; j++) {
        for (let k = j + 1; k < n; k++) {
          const newOrders = [
            [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1, k + 1), ...order.slice(k + 1)],
            [...order.slice(0, i), ...order.slice(i, j + 1), ...order.slice(j + 1, k + 1).reverse(), ...order.slice(k + 1)],
            [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1, k + 1).reverse(), ...order.slice(k + 1)]
          ];
          for (const newOrder of newOrders) {
            if (tourDistance$3(newOrder, dist) < tourDistance$3(order, dist)) {
              order.splice(0, order.length, ...newOrder);
              improved = true;
            }
          }
        }
      }
    }
  }
  const fullPath = [];
  for (let i = 0; i < n - 1; i++) {
    const a = order[i];
    const b = order[i + 1];
    const segment = paths[a][b];
    if (i === 0) {
      fullPath.push(...segment);
    } else {
      fullPath.push(...segment.slice(1));
    }
  }
  const resultOrder = order.map((i) => targets[i]);
  const distance = tourDistance$3(order, dist);
  return { order: resultOrder, path: fullPath, distance };
}
function tourDistance$2(order, dist) {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]][order[i + 1]];
  }
  return total;
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function metaheuristics(graph, targets, shortestPathFunc, populationSize = 50, generations = 200, mutationRate = 0.1) {
  const n = targets.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const paths = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const res = shortestPathFunc(graph, targets[i], targets[j]);
      dist[i][j] = res.distance;
      paths[i][j] = res.path;
    }
  }
  let population = [];
  for (let i = 0; i < populationSize; i++) {
    population.push(shuffle([...Array(n).keys()]));
  }
  for (let gen = 0; gen < generations; gen++) {
    const fitness = population.map((order) => 1 / tourDistance$2(order, dist));
    const newPopulation = [];
    while (newPopulation.length < populationSize) {
      const select = () => {
        const r = Math.random() * fitness.reduce((a, b) => a + b, 0);
        let sum = 0;
        for (let i = 0; i < fitness.length; i++) {
          sum += fitness[i];
          if (sum >= r) return population[i].slice();
        }
        return population[fitness.length - 1].slice();
      };
      let parent1 = select();
      let parent2 = select();
      const start = Math.floor(Math.random() * n);
      const end = start + Math.floor(Math.random() * (n - start));
      const child = Array(n).fill(-1);
      for (let i = start; i < end; i++) child[i] = parent1[i];
      let fillIdx = 0;
      for (let gene of parent2) {
        if (!child.includes(gene)) {
          while (child[fillIdx] !== -1) fillIdx++;
          child[fillIdx] = gene;
        }
      }
      if (Math.random() < mutationRate) {
        const a = Math.floor(Math.random() * n);
        const b = Math.floor(Math.random() * n);
        [child[a], child[b]] = [child[b], child[a]];
      }
      newPopulation.push(child);
    }
    population = newPopulation;
  }
  let best = population[0];
  let bestDist = tourDistance$2(best, dist);
  for (const order of population) {
    const d = tourDistance$2(order, dist);
    if (d < bestDist) {
      best = order;
      bestDist = d;
    }
  }
  const fullPath = [];
  for (let i = 0; i < n - 1; i++) {
    const a = best[i];
    const b = best[i + 1];
    const segment = paths[a][b];
    if (i === 0) {
      fullPath.push(...segment);
    } else {
      fullPath.push(...segment.slice(1));
    }
  }
  const resultOrder = best.map((i) => targets[i]);
  const distance = bestDist;
  return { order: resultOrder, path: fullPath, distance };
}
function twoOptSwap$1(order, i, k) {
  const newOrder = order.slice(0, i);
  const reversed = order.slice(i, k + 1).reverse();
  return newOrder.concat(reversed).concat(order.slice(k + 1));
}
function tourDistance$1(order, dist) {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]][order[i + 1]];
  }
  return total;
}
function nearestNeighbor2OptTSP(graph, targets, shortestPathFunc) {
  const n = targets.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const paths = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const res = shortestPathFunc(graph, targets[i], targets[j]);
      dist[i][j] = res.distance;
      paths[i][j] = res.path;
    }
  }
  const order = [];
  const visited = /* @__PURE__ */ new Set();
  let current = 0;
  order.push(current);
  visited.add(current);
  while (order.length < n) {
    let nearest = -1;
    let nearestDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && dist[current][i] < nearestDist) {
        nearest = i;
        nearestDist = dist[current][i];
      }
    }
    current = nearest;
    order.push(current);
    visited.add(current);
  }
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        const newOrder = twoOptSwap$1(order, i, k);
        if (tourDistance$1(newOrder, dist) < tourDistance$1(order, dist)) {
          order.splice(0, order.length, ...newOrder);
          improved = true;
        }
      }
    }
  }
  const fullPath = [];
  for (let i = 0; i < n - 1; i++) {
    const a = order[i];
    const b = order[i + 1];
    const segment = paths[a][b];
    if (i === 0) {
      fullPath.push(...segment);
    } else {
      fullPath.push(...segment.slice(1));
    }
  }
  const resultOrder = order.map((i) => targets[i]);
  const distance = tourDistance$1(order, dist);
  return { order: resultOrder, path: fullPath, distance };
}
function twoOptSwap(order, i, k) {
  const newOrder = order.slice(0, i);
  const reversed = order.slice(i, k + 1).reverse();
  return newOrder.concat(reversed).concat(order.slice(k + 1));
}
function tourDistance(order, dist) {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]][order[i + 1]];
  }
  return total;
}
function twoOptTSP(graph, targets, shortestPathFunc) {
  const n = targets.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  const paths = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const res = shortestPathFunc(graph, targets[i], targets[j]);
      dist[i][j] = res.distance;
      paths[i][j] = res.path;
    }
  }
  const order = [];
  const visited = /* @__PURE__ */ new Set();
  let current = 0;
  order.push(current);
  visited.add(current);
  while (order.length < n) {
    let nearest = -1;
    let nearestDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && dist[current][i] < nearestDist) {
        nearest = i;
        nearestDist = dist[current][i];
      }
    }
    current = nearest;
    order.push(current);
    visited.add(current);
  }
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        const newOrder = twoOptSwap(order, i, k);
        if (tourDistance(newOrder, dist) < tourDistance(order, dist)) {
          order.splice(0, order.length, ...newOrder);
          improved = true;
        }
      }
    }
  }
  const fullPath = [];
  for (let i = 0; i < n - 1; i++) {
    const a = order[i];
    const b = order[i + 1];
    const segment = paths[a][b];
    if (i === 0) {
      fullPath.push(...segment);
    } else {
      fullPath.push(...segment.slice(1));
    }
  }
  const resultOrder = order.map((i) => targets[i]);
  const distance = tourDistance(order, dist);
  return { order: resultOrder, path: fullPath, distance };
}
function bestTSP(graph, targets) {
  if (targets.length < 15) {
    return heldKarpTSP(graph, targets, astar);
  } else {
    return linKernighanTSP(graph, targets, astar);
  }
}
// export {
//   astar,
//   bestTSP,
//   dijkstra,
//   dijkstraHeap,
//   findNearestNode,
//   getDistance,
//   greedyBestFirstSearch,
//   greedyInsertionTSP,
//   heldKarpTSP,
//   linKernighanTSP,
//   loadGraphAsync,
//   load_city_graph,
//   metaheuristics,
//   nearestNeighbor2OptTSP,
//   shortestPath,
//   twoOptTSP
// };
// //# sourceMappingURL=main.js.map
