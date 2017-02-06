const Sniffer = require('./Sniffer')
const Network = require('./Network')

class ToolManager {

  constructor () {
    this._client = {id: 'not connected'}
    this._currentTool = null
    // this.toolnames = ['Network', 'Info', 'Sniffer']
    this.tools = this.loadTools()
  }

  loadTools () {
    let tools = []
    let sniffer = new Sniffer()
    let network = new Network()
    tools.push(sniffer)
    tools.push(network)
    return tools
  }

  error (msg) {
    console.error(`[ToolManager] ERR : ${msg}`)
  }

  info (msg) {
    console.info(`[ToolManager] : ${msg}`)
  }

  registerClients (socket) {
    for (var tool of this.tools) {
      tool.client = socket
      this.info(`Registering ${tool.client.id} to ${tool.name}`)
    }
  }

  set client (socket) {
    this._client = socket
  }

  get client () {
    return this._client
  }

  set currentTool (toolname) {
    this._currentTool = toolname
  }

  get currentTool () {
    return this._currentTool
  }

  listTools () {
    // Placeholder for when I make the tools modular
    this._client.emit('listTools', this.toolnames)
  }

  load (toolname) {
    let t = this.tools.find(function (tool) {
      return tool.name === toolname
    })
    this._currentTool = t
    if (t === undefined) {
      this.error(`Not Loaded ${toolname}`)
    } else {
      this.info(`Loaded ${toolname}`)
      this.init()
    }
  }

  init () {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Init Attempted`)
      return false
    } else {
      this._currentTool.init(this._client)
    }
  }

  cmd (name, ...args) {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Start Attempted`)
      return false
    } else {
      this._currentTool.cmd(name, ...args)
    }
  }

  start () {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Start Attempted`)
      return false
    } else {
      this._currentTool.start(this._client)
    }
  }

  stop () {
    if (!this._currentTool || !this._client) {
      this.error(`Bad Stop Attempted`)
      return false
    } else {
      this._currentTool.stop(this._client)
    }
  }

  // updateTarget (data) {
  //   if (!this._currentTool || !this._client || this.currentTool.name !== 'Sniffer') {
  //     this.error(`Cant sniff, probably because current tool is not sniffer`)
  //     return false
  //   } else {
  //     this._currentTool.updateTarget(this._client, data)
  //   }
  // }
}
module.exports = ToolManager
