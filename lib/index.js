"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdnlProxyEndpoints = exports.getTonApiV4Endpoint = exports.getTonApiV4Endpoints = exports.getTonCenterV2Endpoint = exports.getTonCenterV2Endpoints = exports.Gateway = void 0;
const nodes_1 = require("./nodes");
class Gateway {
    //////////////////////////////////
    constructor() {
        this.host = "ton.gateway.orbs.network";
        this.urlVersion = 1;
        this.nodes = new nodes_1.Nodes();
    }
    //////////////////////////////////
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nodes.init(`https://${this.host}/nodes`); // pass host when backend endpoint is ready
        });
    }
    //////////////////////////////////
    buildUrls(network, protocol, suffix) {
        // default params
        if (!suffix)
            suffix = "";
        // remove leading slash
        if (suffix.length)
            suffix = suffix.replace(/^\/+/, "");
        const res = [];
        const len = this.nodes.topology.length;
        for (let i = 0; i < len; ++i) {
            const node = this.nodes.getNextNode();
            const url = `https://${this.host}/${node.Name}/${this.urlVersion}/${network}/${protocol}/${suffix}`;
            res.push(url);
        }
        return res;
    }
}
exports.Gateway = Gateway;
//////////////////////////////
// private get multi endpoints
function getEndpoints(network, protocol, suffix) {
    return __awaiter(this, void 0, void 0, function* () {
        const gateway = new Gateway();
        yield gateway.init();
        const res = gateway.buildUrls(network, protocol, suffix);
        return res;
    });
}
/////////////////////////////////////
// global exported explicit functions
// toncenter multi
function getTonCenterV2Endpoints(network, suffix) {
    return __awaiter(this, void 0, void 0, function* () {
        // default params
        if (!network)
            network = "mainnet";
        if (!suffix)
            suffix = "jsonRPC";
        return yield getEndpoints(network, "toncenter-api-v2", suffix);
    });
}
exports.getTonCenterV2Endpoints = getTonCenterV2Endpoints;
// toncenter single
function getTonCenterV2Endpoint(network, suffix) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoints = yield getTonCenterV2Endpoints(network, suffix);
        const index = Math.floor(Math.random() * endpoints.length);
        return endpoints[index];
    });
}
exports.getTonCenterV2Endpoint = getTonCenterV2Endpoint;
// API V4 - multi
function getTonApiV4Endpoints(suffix) {
    return __awaiter(this, void 0, void 0, function* () {
        // other networks than mainnet are not supported
        return yield getEndpoints("mainnet", "ton-api-v4", suffix);
    });
}
exports.getTonApiV4Endpoints = getTonApiV4Endpoints;
// API V4 - single
function getTonApiV4Endpoint(suffix) {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoints = yield getTonApiV4Endpoints(suffix);
        const index = Math.floor(Math.random() * endpoints.length);
        return endpoints[index];
    });
}
exports.getTonApiV4Endpoint = getTonApiV4Endpoint;
// WS ADNL PROXY
function getAdnlProxyEndpoints() {
    return __awaiter(this, void 0, void 0, function* () {
        return [
            //"ws://ton-http-2:30001"
            "ws://18.221.31.187:30001",
            //"ws://3.140.253.61:30001",
        ];
    });
}
exports.getAdnlProxyEndpoints = getAdnlProxyEndpoints;
// export async function getAdnlProxyEndpoint(): Promise<string> {
//   const endpoints = await getAdnlProxyEndpoints();
//   const index = Math.floor(Math.random() * endpoints.length);
//   return endpoints[index];
// }
// import { initLiteClient } from "./debug";
// async function dbg() {
//   const lc = await initLiteClient();
//   try {
//     const info = await lc?.getMasterchainInfo();
//     console.log(info);
//   } catch (e) {
//     console.error(e);
//   }
// }
// dbg();
//# sourceMappingURL=index.js.map