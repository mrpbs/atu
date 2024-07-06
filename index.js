 const mineflayer = require('mineflayer')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
//const mc = require('minecraft-protocol');
const AutoAuth = require('mineflayer-auto-auth');
//const app = express();
//const mineflayerViewer = require('prismarine-viewer').mineflayer
async function createBot(){

const bot = mineflayer.createBot({
  //host: "1234Mahamed.aternos.me",//
   host: "", 
  version: false, // U can replace with 1.16.5 for example, remember to use ', = '1.16.5'
  username: 'ChowkidarXD', 
 // port: 40568,//
   port: 32815, 
  plugins: [AutoAuth],
  AutoAuth: 'bot112022'
})



/// DONT TOUCH ANYTHING MORE!
bot.loadPlugin(pvp)
bot.loadPlugin(armorManager)
bot.loadPlugin(pathfinder)

  
bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return

  setTimeout(() => {
    const sword = bot.inventory.items().find(item => item.name.includes('sword'))
    if (sword) bot.equip(sword, 'hand')
  }, 150)
})

bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return

  setTimeout(() => {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'))
    if (shield) bot.equip(shield, 'off-hand')
  }, 250)
})

let guardPos = null

function guardArea (pos) {
  guardPos = pos.clone()

  if (!bot.pvp.target) {
    moveToGuardPos()
  }
}

function stopGuarding () {
  guardPos = null
  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}

function moveToGuardPos () {
  const mcData = require('minecraft-data')(bot.version)
  bot.pathfinder.setMovements(new Movements(bot, mcData))
  bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}

bot.on('stoppedAttacking', () => {
  if (guardPos) {
    moveToGuardPos()
  }
})

bot.on('physicTick', () => {
  if (bot.pvp.target) return
  if (bot.pathfinder.isMoving()) return

  const entity = bot.nearestEntity()
  if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
})
bot.on('physicTick', () => {
  if (!guardPos) return
  const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
                      e.mobType !== 'Armor Stand' 
  const entity = bot.nearestEntity(filter)
  if (entity) {
    bot.setControlState('jump', true);
    bot.pvp.attack(entity)
  }
})
bot.on('chat',async (username, message) => {
  if (message === '!guard') {
    const player = bot.players[username]

    if (!player) {
    await bot.chat('come closer to me and use this command again!')
 } else {
 await bot.chat("guarding ur position")
      guardArea(player.entity.position)
    }

  }
    if (message === '!stop') {
   await bot.chat('ok stoped!')
    stopGuarding()
  }
    if(message=== '!tp') {
       await bot.chat(`/tpa ${username}`)
        console.log(username)
        }
})
process.stdin.on('data', async(data) => {
  const message = data.toString().trim()
  if (message === '!tp') {
   await bot.chat('/tpa Hishami71')
  }else if (message.startsWith('!say ')) {
    const sayMessage = message.slice(5)
   await bot.chat(sayMessage)
  }else if (message === "!join"){
   createBot()  
      console.log("joining")
      }
})
  bot.once('spawn', () => {
      console.log("joined")
  //  mineflayerViewer(bot, { port: 3132, firstPerson: false })
  })
bot.on('kicked', console.log)
bot.on('error', console.log)
bot.on('end', createBot)
}
createBot()
