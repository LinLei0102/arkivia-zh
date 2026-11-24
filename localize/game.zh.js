const VERSION = "0.27.2"

const gameTitleElement = document.getElementById("game-title")
gameTitleElement.textContent = `Arkivia v${VERSION}`

let money = 0
let time = 420
let oldScene = ""
let currentScene = ""
let sceneText = ""
let prependText = ""
let currentPrependText = ""
let region = "未知"
let health = 10
let xp = 0
let playerTitle = "未知"
let travelStatus = {
    "destination": null,
    "distance": 0,
    "completed": 0,
    "backwards": false
}
let battleStats = {
    "str": 1,
    "def": 1,
    "spd": 1,
    "dex": 1
}
let combatStatus = {
    "enemy": null,
    "enemyHealth": 0,
    "enemyMaxHealth": 0,
    "enemyStats": {
        "str": 0,
        "def": 0,
        "spd": 0,
        "dex": 0
    },
    "enemyProperties": [],
    "enemyEffects": {}
}
let checks = {}
let dailyChecks = {}
let logAutoScroll = true
let skills = {}
let inventory = {}
let inventoryNonStackable = {}
let inventoryNonStackableIncrement = 0
let storage = {}
let storageNonStackable = {}
let storageAccess = false
let inventoryWeight = 0
let energy = 100
let noSleepTime = 0
let effects = {}
let quests = {}
let questProgression = {}
let completedQuests = []
let stats = {
    "playtime": 0,
    "gametime": 0
}
let shopStorage = {}
let knownRecipes = ["strawBasket", "woodenSpear"]
let craftStatus = {
    "recipe": null,
    "goal": 0,
    "completed": 0,
    "required": {},
    "using": [],
    "selected": null,
    "skillXp": 0,
}
let team = "none"
let equipment = {
    "weapon": null,
    "tool": null,
    "head": null,
    "chest": null,
    "arms": null,
    "legs": null,
    "accessory1": null,
    "accessory2": null
}
let exploreStatus = {
    "area": null,
    "goal": 0,
    "completed": 0
}
let processStatus = {
    "type": null,
    "area": null,
    "goal": 0,
    "completed": 0
}
let saveEnabled = true
let craftingSelection = false
let titleScores = {}
let arenaData = {}
let debugEnabled = false
let discardMode = false

const linkRegex = new RegExp(/\{([^|{}]+)\|([^|{}]+)\|?([^|{}]+)?\|?([^|{}(]+)?\(?([^(){}|]+)?\)?}/g)
const textSplitter = new RegExp(/{[^}]{1,}}/g)
const imageRegex = new RegExp(/!\[(.*?)\]/g)
const enemyData = {
    "strawDummy": {
        "name": "稻草人偶",
        "health": [40, 50],
        "str": 0,
        "def": [2.5, 3],
        "spd": 0,
        "dex": 0,
        "loot": [
            {"item": "straw", "chances": {
                0: 40,
                1: 50,
                2: 10
            }}
        ],
        "xp": [3, 5]
    },
    "mouse": {
        "name": "老鼠",
        "health": [12, 18],
        "str": [0.15, 0.2],
        "def": [0.2, 0.3],
        "spd": [1.5, 2],
        "dex": [1.5, 2],
        "xp": [3, 5]
    },
    "strawGolem": {
        "name": "稻草魔像",
        "health": 150,
        "str": 1,
        "def": 2,
        "spd": 1,
        "dex": 0.5,
        "loot": [
            {"item": "straw", "chances": {
                1: 25,
                2: 25,
                3: 25,
                4: 25,
            }}
        ],
        "xp": 20
    },
    "woodGolem": {
        "name": "木魔像",
        "health": 400,
        "str": 10,
        "def": 10,
        "spd": 5,
        "dex": 2,
        "xp": 60
    },
    "stoneGolem": {
        "name": "石魔像",
        "health": 800,
        "str": 40,
        "def": 40,
        "spd": 20,
        "dex": 5,
        "xp": 100
    },
    "coalGolem": {
        "name": "煤炭魔像",
        "health": 800,
        "str": 100,
        "def": 100,
        "spd": 50,
        "dex": 30,
        "xp": 150
    },
    "human": {
        "name": "人类"
    },
    "greenSlime": {
        "name": "绿色史莱姆",
        "health": [50, 100],
        "str": [4, 6],
        "def": [1, 2],
        "spd": [2, 3],
        "dex": [3, 4],
        "loot": [
            {"item": "slime", "chances": {
                0: 40,
                1: 50,
                2: 10
            }}
        ],
        "xp": [7, 10]
    },
    "blueSlime": {
        "name": "蓝色史莱姆",
        "health": [80, 140],
        "str": [5, 7],
        "def": [1.5, 2.5],
        "spd": [3, 4],
        "dex": [5, 6],
        "loot": [
            {"item": "slime", "chances": {
                0: 20,
                1: 60,
                2: 10,
                3: 10
            }}
        ],
        "xp": [10, 12]
    },
    "purpleSlime": {
        "name": "紫色史莱姆",
        "health": [150, 200],
        "str": [9, 12],
        "def": [4, 6],
        "spd": [5, 7],
        "dex": [7, 9],
        "loot": [
            {"item": "slime", "chances": {
                1: 50,
                2: 30,
                3: 20
            }}
        ],
        "xp": [15, 20]
    },
    "lizard": {
        "name": "蜥蜴",
        "health": [100, 150],
        "str": [4, 5],
        "def": [2, 3],
        "spd": [4, 5],
        "dex": [6, 8],
        "xp": [10, 13]
    },
    "spider": {
        "name": "蜘蛛",
        "health": [80, 110],
        "str": [6, 7],
        "def": [2, 3],
        "spd": [7, 8],
        "dex": [3, 5],
        "xp": [10, 13]
    },
    "venomousSpider": {
        "name": "毒蜘蛛",
        "health": [200, 250],
        "str": [6, 7],
        "def": [2, 3],
        "spd": [7, 8],
        "dex": [3, 5],
        "xp": [15, 20],
        "attackExecute": function(dmg) {
            if (dmg > 0) {
                if (Math.random() <= 0.3) {
                    changeEffect("poison", 4, false, {"change": 0.8, "dmg": dmg / 2})
                    insertLog(colorGen(effectData['poison']['color'], `你中毒了`))
                }
            }
        }
    },
    "death": {
        "name": "死亡",
        "health": 1e6,
        "str": 1e12,
        "def": 1e12,
        "spd": 1e12,
        "dex": 1e12,
        "attackExecute": function() {
            insertLog(colorGen("#bb7777", "你不该走到这一步的……"))
        }
    },
    "bat": {
        "name": "蝙蝠",
        "health": [100, 150],
        "str": [10, 15],
        "def": [5, 8],
        "spd": [20, 25],
        "dex": [25, 30],
        "xp": [10, 13]
    },
    "wildAnimal": {
        "name": "野兽"
    }
}
const skillData = {
    "walking": {
        "name": "步行",
        "desc": "让你步行赶路时速度更快",
        "scaling": 1.3,
        "levelExec": function(level) {
            updateArrival()
        }
    },
    "fighting": {
        "name": "战斗",
        "desc": "略微提升造成的伤害",
        "scaling": 1.3
    },
    "training": {
        "name": "训练",
        "desc": "提升训练获得的属性",
        "scaling": 1.2
    },
    "crafting": {
        "name": "制作",
        "desc": "提升制作速度",
        "scaling": 1.2,
        "levelExec": function(level) {
            updateArrival("craft")
        }
    },
    "exploration": {
        "name": "探索",
        "desc": "提升探索速度",
        "scaling": 1.3
    },
    "unarmedMastery": {
        "name": "徒手精通",
        "shortName": "徒手",
        "desc": "空手时提升造成的伤害",
        "scaling": 1.3,
    },
    "clubMastery": {
        "name": "棍棒精通",
        "shortName": "棍棒",
        "desc": "提升棍棒类武器的伤害",
        "scaling": 1.3,
    },
    "spearMastery": {
        "name": "长矛精通",
        "shortName": "长矛",
        "desc": "提升长矛类武器的伤害",
        "scaling": 1.3,
    },
    "knifeMastery": {
        "name": "小刀精通",
        "shortName": "小刀",
        "desc": "提升小刀类武器的伤害",
        "scaling": 1.3,
    },
    "swordMastery": {
        "name": "剑精通",
        "shortName": "剑",
        "desc": "提升剑类武器的伤害",
        "scaling": 1.3,
    },
    "alchemy": {
        "name": "炼金",
        "desc": "提升炼金速度并解锁更多配方",
        "scaling": 1.2,
        "levelExec": function(level) {
            updateArrival("craft")
        }
    },
    "mining": {
        "name": "采矿",
        "desc": "提升采矿速度",
        "scaling": 1.3
    },
    "felling": {
        "name": "伐木",
        "desc": "提升砍树速度",
        "scaling": 1.3
    },
    "sleeping": {
        "name": "睡眠",
        "desc": "提升睡眠时的体力恢复",
        "scaling": 1.3
    },
    "hunting": {
        "name": "狩猎",
        "desc": "提升狩猎速度",
        "scaling": 1.3
    }
}
const itemClasses = {
    "misc": "#cccccc",
    "consumable": "#ffcc22",
    "gear": "#ff8888",
    "tool": "#00bb66"
}
const itemData = {
    "straw": {
        "name": "一根稻草",
        "desc": "从训练人偶上掉下来的一根稻草",
        "class": "misc",
        "weight": 0.5,
        "obtainExecute": function() {
            if (inventory['straw'] >= 25) {
                discoverRecipe("strawPendant")
                discoverRecipe("strawHelmet")
                discoverRecipe("strawChestplate")
                discoverRecipe("strawBracers")
                discoverRecipe("strawLeggings")
            }
        }
    },
    "exercisePill": {
        "name": "锻炼药丸",
        "desc": "一小时内训练获得的属性提升 50%（可叠加）",
        "class": "consumable",
        "weight": 1,
        "execute": function() {
            changeEffect("exercisePill", 60)
        }
    },
    "strawBasket": {
        "name": "草篮",
        "desc": "用稻草编成的小篮子",
        "class": "misc",
        "weight": 10,
        "crafting": {
            "complexity": 60,
            "materials": {
                "straw": 20
            }
        }
    },
    "woodenStick": {
        "name": "木棍",
        "desc": "一根钝木棍，比你的拳头好不了多少",
        "class": "gear",
        "subclass": "club",
        "weight": 120,
        "durability": [80, 120],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.2, 1.4]
        }
    },
    "grass": {
        "name": "草叶",
        "desc": "可用于制作治疗药水",
        "class": "misc",
        "weight": 0.2
    },
    "woodenSpear": {
        "name": "木矛",
        "desc": "削尖的木棍，更耐用，伤害也更高",
        "class": "gear",
        "subclass": "spear",
        "weight": 100,
        "durability": [200, 300],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.4, 1.5]
        },
        "crafting": {
            "complexity": 30,
            "materials": {
                "woodenStick": 1,
                "knife": 0
            }
        }
    },
    "knife": {
        "name": "小刀",
        "desc": "用石头打磨出来的基础小刀",
        "class": "gear",
        "subclass": "knife",
        "weight": 300,
        "durability": [800, 1200],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.5, 1.7]
        }
    },
    "slime": {
        "name": "史莱姆",
        "desc": "黏糊糊的",
        "class": "misc",
        "weight": 2
    },
    "strawPendant": {
        "name": "稻草吊坠",
        "desc": "用稻草编成的小吊坠，全属性提升 10%",
        "class": "gear",
        "weight": 25,
        "stackable": false,
        "equipment": {
            "class": "accessory",
            "effects": {
                "all": 0.1
            }
        },
        "crafting": {
            "complexity": 60,
            "materials": {
                "straw": 50
            }
        }
    },
    "woodenClub": {
        "name": "木棒",
        "desc": "中等大小的木棒，能给敌人一点小小的冲击",
        "class": "gear",
        "subclass": "club",
        "weight": 500,
        "durability": [300, 500],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.3, 1.5]
        }
    },
    "largeWoodenClub": {
        "name": "大木棒",
        "desc": "木棒的加大版，挥动费力，但有机会击晕敌人",
        "class": "gear",
        "subclass": "club",
        "weight": 1500,
        "durability": [800, 1200],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.5, 1.8],
            "effects": {
                "spd": -0.25
            },
            "execute": function(dmg) {
                if (dmg > 0) {
                    if (Math.random() <= 0.1) {
                        changeEnemyEffect("stun", time + 2, true)
                        insertLog(colorGen(effectData['stun']['color'], `${enemyData[combatStatus['enemy']]['name']} 被击晕了`))
                    }
                }
            }
        }
    },
    "copperSword": {
        "name": "铜剑",
        "desc": "用铜打造的基础剑，有点钝，但砍起来还算顺手",
        "class": "gear",
        "subclass": "sword",
        "weight": 1000,
        "durability": [1300, 1500],
        "stackable": false,
        "equipment": {
            "class": "weapon",
            "damage": [1.7, 2]
        }
    },
    "cauldron": {
        "name": "大锅",
        "desc": "用于制作药水",
        "class": "tool",
        "weight": 4000,
        "obtainExecute": function() {
            discoverRecipe("basicHealthPotion")
        }
    },
    "basicHealthPotion": {
        "name": "基础治疗药水",
        "desc": "简单的小瓶治疗药水，回复 30 点生命",
        "class": "consumable",
        "weight": 50,
        "execute": function() {
            changeHealth(30)
        },
        "crafting": {
            "type": "alchemy",
            "complexity": 50,
            "materials": {
                "slime": 2,
                "grass": 1,
                "cauldron": 0
            }
        }
    },
    "wood": {
        "name": "木材",
        "desc": "可以作为燃料",
        "class": "misc",
        "weight": 100
    },
    "strawHelmet": {
        "name": "稻草头盔",
        "desc": "稻草编成的基础头盔",
        "class": "gear",
        "weight": 25,
        "durability": [150, 250],
        "stackable": false,
        "equipment": {
            "class": "head",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 50
            }
        }
    },
    "strawChestplate": {
        "name": "稻草胸甲",
        "desc": "稻草编成的基础胸甲",
        "class": "gear",
        "weight": 50,
        "durability": [300, 500],
        "stackable": false,
        "equipment": {
            "class": "chest",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 100
            }
        }
    },
    "strawBracers": {
        "name": "稻草护腕",
        "desc": "稻草编成的基础护腕",
        "class": "gear",
        "weight": 25,
        "durability": [150, 250],
        "stackable": false,
        "equipment": {
            "class": "arms",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 50
            }
        }
    },
    "strawLeggings": {
        "name": "稻草护腿",
        "desc": "稻草编成的基础护腿",
        "class": "gear",
        "weight": 25,
        "durability": [150, 250],
        "stackable": false,
        "equipment": {
            "class": "legs",
            "armor": [1.8, 2.2]
        },
        "crafting": {
            "complexity": 90,
            "materials": {
                "straw": 50
            }
        }
    },
    "woodenPickaxe": {
        "name": "木镐",
        "desc": "没人知道这东西为什么能挖开石头",
        "class": "gear",
        "subclass": "pickaxe",
        "weight": 300,
        "durability": [90, 120],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "efficiency": 1,
            "equipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.innerHTML = `你正用镐子开采石头和其他材料${processingGen()}`
                }
            },
            "unequipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.textContent = "采矿需要先装备一把镐子。"
                }
            }
        },
        "crafting": {
            "complexity": 60,
            "materials": {
                "wood": 3
            }
        }
    },
    "stone": {
        "name": "石头",
        "desc": "有点沉，可以用来制作更强的装备",
        "class": "misc",
        "weight": 300,
        "obtainExecute": function() {
            discoverRecipe("stonePickaxe")
            discoverRecipe("stoneAxe")
        }
    },
    "woodenAxe": {
        "name": "木斧",
        "desc": "用木头来砍木头",
        "class": "gear",
        "subclass": "axe",
        "weight": 300,
        "durability": [90, 120],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "equipExecute": generateActions,
            "unequipExecute": generateActions
        },
        "crafting": {
            "complexity": 60,
            "materials": {
                "wood": 3
            }
        }
    },
    "huntersGuildSupplies": {
        "name": "补给箱",
        "desc": "给猎人公会的补给",
        "class": "misc",
        "weight": 10000,
        "undeletable": true
    },
    "strangeTrainingCharm": {
        "name": "奇异的训练护符",
        "desc": "佩戴时提升训练收益，但训练时会损失生命",
        "class": "gear",
        "weight": 1000,
        "stackable": false,
        "undeletable": true,
        "equipment": {
            "class": "accessory",
        }
    },
    "stonePickaxe": {
        "name": "石镐",
        "desc": "用和你正在开采的东西相同的材料做成，更耐用也更快",
        "class": "gear",
        "subclass": "pickaxe",
        "weight": 1500,
        "durability": [300, 400],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "efficiency": 1.2,
            "equipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.innerHTML = `你正用镐子开采石头和其他材料${processingGen()}`
                }
            },
            "unequipExecute": function() {
                if (currentScene === "forestMine") {
                    const actionText = document.getElementById("action-text")
                    actionText.textContent = "采矿需要先装备一把镐子。"
                }
            }
        },
        "crafting": {
            "complexity": 120,
            "materials": {
                "stone": 5
            }
        }
    },
    "stoneAxe": {
        "name": "石斧",
        "desc": "用石头来砍木头",
        "class": "gear",
        "subclass": "axe",
        "weight": 1500,
        "durability": [300, 400],
        "stackable": false,
        "equipment": {
            "class": "tool",
            "efficiency": 1.2,
            "equipExecute": generateActions,
            "unequipExecute": generateActions
        },
        "crafting": {
            "complexity": 120,
            "materials": {
                "stone": 5
            }
        }
    },
    "apple": {
        "name": "苹果",
        "desc": "回复 10 点体力",
        "class": "consumable",
        "weight": 100,
        "execute": function() {
            changeEnergy(10)
        }
    }
}
const effectData = {
    "sleepDeprived": {
        "name": "睡眠不足",
        "desc": "每分钟体力消耗增加",
        "color": "#006666"
    },
    "exercisePill": {
        "name": "锻炼药丸",
        "desc": "属性获取提升 50%",
        "color": "#cccc00"
    },
    "wet": {
        "name": "湿透",
        "desc": "体力消耗增加",
        "color": "#5555ff"
    },
    "stun": {
        "name": "眩晕",
        "desc": "无法攻击",
        "color": "#995555"
    },
    "poison": {
        "name": "中毒",
        "desc": "持续受到伤害",
        "color": "#990099"
    }
}
const questData = {
    "dojoIntro1": {
        "name": "道场入门 1",
        "desc": "教官要你击败 5 个稻草人偶，并把力量提升到 1.5",
        "repeatable": false,
        "goals": {
            "kills": {
                "strawDummy": {
                    "amount": 5,
                    "lifetime": false
                }
            },
            "stats": {
                "str": {
                    "amount": 1.5,
                    "lifetime": true
                }
            }
        }
    },
    "dojoIntro2": {
        "name": "道场入门 2",
        "desc": "教官要你把每项属性都提升到 1.5",
        "repeatable": false,
        "goals": {
            "stats": {
                "str": {
                    "amount": 1.5,
                    "lifetime": true
                },
                "def": {
                    "amount": 1.5,
                    "lifetime": true
                },
                "spd": {
                    "amount": 1.5,
                    "lifetime": true
                },
                "dex": {
                    "amount": 1.5,
                    "lifetime": true
                }
            }
        }
    },
    "dojoIntro3": {
        "name": "除害",
        "desc": "教官要你在巷子里击败 10 只老鼠",
        "repeatable": false,
        "goals": {
            "kills": {
                "mouse": {
                    "amount": 10,
                    "lifetime": false
                }
            },
        }
    },
    "dojoIntro4": {
        "name": "道场入门 4",
        "desc": "教官要你击败道场院子里的魔像",
        "repeatable": false,
        "goals": {
            "kills": {
                "strawGolem": {
                    "amount": 1,
                    "lifetime": false
                }
            },
        }
    },
    "dojoIntro5": {
        "name": "道场入门 5",
        "desc": "教官要你把每项属性都提升到 10",
        "repeatable": false,
        "goals": {
            "stats": {
                "str": {
                    "amount": 10,
                    "lifetime": true
                },
                "def": {
                    "amount": 10,
                    "lifetime": true
                },
                "spd": {
                    "amount": 10,
                    "lifetime": true
                },
                "dex": {
                    "amount": 10,
                    "lifetime": true
                }
            }
        }
    },
    "els1": {
        "name": "埃尔斯的委托",
        "desc": "埃尔斯请你弄到 3 份木材",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "wood": {"amount": 3}
            }
        }
    },
    "els2": {
        "name": "清理森林",
        "desc": "埃尔斯请你清理森林里的道路",
        "repeatable": false,
        "goals": {
            "checks": {
                "forestLayer1EnemiesRemaining": {
                    "name": "已清理",
                    "lifetime": true,
                    "amount": 100,
                    "check": function() {return 100 - (checks['forestLayer1EnemiesRemaining'] ?? 100)}
                }
            }
        }
    },
    "els3": {
        "name": "猎人公会补给",
        "desc": "埃尔斯请你去城里的商人那里取补给，再带回来给他",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "huntersGuildSupplies": {"amount": 1}
            }
        }
    },
    "els4": {
        "name": "猎人公会补给 2",
        "desc": "埃尔斯请你弄到 10 块石头",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "stone": {"amount": 10}
            }
        }
    },
    "els5": {
        "name": "猎人公会补给 3",
        "desc": "埃尔斯请你弄到 20 份木材",
        "repeatable": false,
        "manualComplete": true,
        "goals": {
            "items": {
                "wood": {"amount": 20}
            }
        }
    },
}
const shopData = {
    "merchant": [
        {"name": "exercisePill", "chance": 100, "quantity": [1, 3], "price": [5, 7]},
        {"name": "knife", "chance": 50, "quantity": [1, 1], "price": [19, 25]},
        {"name": "cauldron", "chance": 30, "quantity": [1, 1], "price": [60, 80]},
        {"name": "apple", "chance": 70, "quantity": [2, 3], "price": [3, 5]}
    ],
    "weaponShop": [
        {"name": "woodenClub", "chance": 100, "quantity": [1, 1], "price": [10, 15]},
        {"name": "largeWoodenClub", "chance": 50, "quantity": [1, 1], "price": [35, 50]},
        {"name": "copperSword", "chance": 30, "quantity": [1, 1], "price": [35, 50]},
    ]
}
const gyms = {
    "none": {
        "str": 0.01,
        "def": 0.01,
        "spd": 0.01,
        "dex": 0.01
    },
    "nextLevel": {
        "str": 0.02,
        "def": 0.02,
        "spd": 0.02,
        "dex": 0.02
    },
    "forestGymBasic": {
        "str": 0.03,
        "def": 0.03,
        "spd": 0.03,
        "dex": 0.03
    },
    "forestGymAdvanced": {
        "str": 0.05,
        "def": 0.05,
        "spd": 0.05,
        "dex": 0.05
    }
}
const titleData = {
    "athlete": {"name": "运动员"},
    "fighter": {"name": "格斗家"},
    "disciple": {"name": "门徒"},
    "seeker": {"name": "求道者"},
    "crafter": {"name": "工匠"},
    "sleeper": {"name": "睡神"},
    "alchemist": {"name": "炼金师"},
    "miner": {"name": "矿工"},
    "lumberjack": {"name": "伐木工"},
    "walker": {"name": "行者"}
}
const arenaStatData = [
    {"health": [30, 40], "stats": [4,6], "reward": 10},
    {"health": [60, 80], "stats": [10,15], "reward": 20},
    {"health": [120, 150], "stats": [20,30], "reward": 30},
    {"health": [200, 300], "stats": [50,100], "reward": 50},
    {"health": [400, 600], "stats": [200,300], "reward": 70},
    {"health": [800, 1_000], "stats": [600,800], "reward": 100},
    // {"enemyType": "death", "reward": 0} // Until future content is made
]
const statTypes = ["str", "def", "spd", "dex"]

function getDayName(date=null) {
    const dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    if (date === null) {
        return getDayName(minutesToDate(time))
    }
    return dayNames[date.getDay()]
}

function minutesToDate(time) {
    const baseDate = new Date(1600, 0, 1)
    baseDate.setMinutes(baseDate.getMinutes() + time)
    return baseDate
}

function formatTime(time, timeOnly=false, customFormat=null) {
    const baseDate = minutesToDate(time)

    const dayName = getDayName(baseDate)
    const timeName = getTimeName(time)

    const year = baseDate.getFullYear()
    const month = String(baseDate.getMonth() + 1).padStart(2, "0")
    const day = String(baseDate.getDate()).padStart(2, "0")

    const hours = String(baseDate.getHours()).padStart(2, "0")
    const minutes = String(baseDate.getMinutes()).padStart(2, "0")

    const timeString = `${hours}:${String(Math.round(minutes)).padStart(2, "0")}`
    if (timeOnly) {
        return timeString
    }
    if (!settings['dateFormat'] && !customFormat) {
        if (!settings['mobileLayout']) {
            return `${dayName} ${capitaliseFirst(timeName)} ${year}-${month}-${day} ${timeString}`
        } else {
            return `${dayName.slice(0, 3)} ${capitaliseFirst(timeName)} ${year}-${month}-${day} ${timeString}`
        }
    } else {
        return formatString(customFormat ?? settings['dateFormat'], {
            "dayName": dayName,
            "shortDayName": dayName.slice(0, 3),
            "timeName": capitaliseFirst(timeName),
            "year": year,
            "month": month,
            "day": day,
            "hours": hours,
            "minutes": minutes
        })
    }
}

function getDay(timeNow=time) {
    return Math.ceil((timeNow + 1) / 1440)
}

function xpToLevel(xp, decimals=false, r=1.1) {
    let n = Math.log((xp * (r - 1)) / 50 + 1) / Math.log(r)
    return decimals ? n : Math.floor(n)
}

function levelToXp(level, r=1.1) {
    return 50 * (Math.pow(r, level) - 1) / (r - 1)
}

function xpForLevel(level, r=1.1) {
    return levelToXp(level + 1, r) - levelToXp(level, r)
}

function xpIntoLevel(xp, r=1.1) {
    const level = xpToLevel(xp, false, r)
    const levelStartXp = levelToXp(level, r)
    return Math.max(0, xp - levelStartXp)
}

function calcMaxHp(level=xpToLevel(xp)) {
    return Math.round(2 * level ** 1.5 + level + 10)
}

const ranks = [
    {"rank": "G-", "max": 5},
    {"rank": "G", "max": 20},
    {"rank": "G+", "max": 100},
    {"rank": "F-", "max": 500},
    {"rank": "F", "max": 2000},
    {"rank": "F+", "max": 10_000},
    {"rank": "E-", "max": 40_000},
    {"rank": "E", "max": 200_000},
    {"rank": "E+", "max": 1_000_000},
    {"rank": "D-", "max": 5_000_000},
    {"rank": "D", "max": 25_000_000},
    {"rank": "D+", "max": 100_000_000},
    {"rank": "C-", "max": 500_000_000},
    {"rank": "C", "max": 2_500_000_000},
    {"rank": "C+", "max": 10_000_000_000},
    {"rank": "B-", "max": 1e11},
    {"rank": "B", "max": 1e12},
    {"rank": "B+", "max": Infinity},
]

function getRank(total) {
    return ranks.find(r => (total ?? getTotalBattlestats()) < r['max'])['rank']
}

let achievements = []

function statAchievement(data) {
    return {
        "name": data['name'],
        "desc": data['desc'],
        "check": function() {return data['check']() >= data['goal']},
        "goal": [data['goal'], data['check']]
    }
}

const achievementData = {
    "firstBlood": statAchievement({
        "name": "首杀",
        "desc": "击败 1 个敌人",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 1
    }),
    "hunter": statAchievement({
        "name": "猎人",
        "desc": "击败 10 个敌人",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 10
    }),
    "killer": statAchievement({
        "name": "杀手",
        "desc": "击败 100 个敌人",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 100
    }),
    "exterminator": statAchievement({
        "name": "清道夫",
        "desc": "击败 1,000 个敌人",
        "check": function() {return stats['totalKills'] ?? 0},
        "goal": 1000
    }),
    "collector": statAchievement({
        "name": "收藏家",
        "desc": "发现 10 种物品",
        "check": function() {return stats['discoveredItems']?.length ?? 0},
        "goal": 10
    }),
    "hoarder": {
        "name": "囤积狂",
        "desc": "一次携带 200 个以上同种物品"
    },
    "flatline": {
        "name": "一击必杀",
        "desc": "一击击败一个敌人",
    },
    "overkill": {
        "name": "溢出伤害",
        "desc": "单次造成敌人最大生命 3 倍以上的伤害"
    },
    "discovery": {
        "name": "新发现",
        "desc": "解锁一个制作配方",
    },
    "survivor": {
        "name": "幸存者",
        "desc": "以 5% 或更低生命赢得战斗（仅限会攻击的敌人）",
    },
    "insomniac": statAchievement({
        "name": "失眠症",
        "desc": "保持清醒 48 小时",
        "check": function() {return (stats['timeAwake'] ?? 0) / 60},
        "goal": 48
    }),
    "money1": statAchievement({
        "name": "金钱",
        "desc": "赚到 $1",
        "check": function() {return money},
        "goal": 1
    }),
    "money10": statAchievement({
        "name": "零花钱",
        "desc": "赚到 $10",
        "check": function() {return money},
        "goal": 10
    }),
    "money100": statAchievement({
        "name": "小有积蓄",
        "desc": "赚到 $100",
        "check": function() {return money},
        "goal": 100
    }),
    "crafter": {
        "name": "工匠",
        "desc": "制作一件物品",
    },
    "skilled": statAchievement({
        "name": "熟手",
        "desc": "解锁 10 个技能",
        "check": function() {return Object.keys(skills).length},
        "goal": 10
    }),
    "untouchable": {
        "name": "无伤",
        "desc": "不受任何伤害赢得战斗（仅限会攻击的敌人）",
    },
    "golemBreaker": {
        "name": "破魔像者",
        "desc": "击败一个魔像",
    },
    "wasteful": statAchievement({
        "name": "败家",
        "desc": "丢弃 10 件物品",
        "check": function() {return stats['itemsDeleted'] ?? 0},
        "goal": 10
    }),
    "firstSteps": statAchievement({
        "name": "第一步",
        "desc": "行走 5 公里",
        "check": function() {return stats['distanceTravelled'] ?? 0},
        "goal": 5000
    }),
    "walker": statAchievement({
        "name": "行者",
        "desc": "行走 10 公里",
        "check": function() {return stats['distanceTravelled'] ?? 0},
        "goal": 10_000
    }),
    "marathon": statAchievement({
        "name": "马拉松",
        "desc": "行走 25 公里",
        "check": function() {return stats['distanceTravelled'] ?? 0},
        "goal": 25_000
    }),
    "deforestation": statAchievement({
        "name": "滥伐",
        "desc": "砍倒 100 棵树",
        "check": function() {return stats['treesCut'] ?? 0},
        "goal": 100
    })
}

function checkAchievement(achievement) {
    if (!achievements.includes(achievement) && achievementData[achievement]['check'] && achievementData[achievement]['check']()) {
        insertLog(`成就解锁：${colorGen("#ffff00", `"${achievementData[achievement]['name']}"`)}`)
        document.getElementById("achievements-button").style.display = ""
        achievements.push(achievement)
        const achievementParent = document.getElementById(`achievement-${achievement}`)
        if (achievementParent) {
            achievementParent.getElementsByClassName("achievement-title")[0].style.color = "#ffff00"
            if (achievementData[achievement]['goal']) {
                const achievementProgress = achievementParent.getElementsByClassName("achievement-progress")[0]
                const achievementBar = achievementParent.getElementsByClassName("achievement-bar")[0]
                if (achievementProgress) {achievementProgress.remove()}
                if (achievementBar) {achievementBar.remove()}
            }
        }
        return true
    } else if (achievementData[achievement]['goal']) {
        const achievementParent = document.getElementById(`achievement-${achievement}`)
        if (achievementParent) {
            const achievementProgress = achievementParent.getElementsByClassName("achievement-progress")[0]
            const achievementBar = achievementParent.getElementsByClassName("achievement-bar")[0]
            if (achievementProgress) {achievementProgress.textContent = `${formatNumber(achievementData[achievement]['goal'][1]())} / ${formatNumber(achievementData[achievement]['goal'][0])}`}
            if (achievementBar) {achievementBar.style.width = `${Math.min(achievementData[achievement]['goal'][1]() / achievementData[achievement]['goal'][0] * 100, 100)}%`}
        }
    }
    return false
}

function checkAchievements(achievements) {
    for (const achievement of achievements) {
        checkAchievement(achievement)
    }
}

function giveAchievement(achievement) {
    if (!achievements.includes(achievement)) {
        insertLog(`成就解锁：${colorGen("#ffff00", `"${achievementData[achievement]['name']}"`)}`)
        document.getElementById("achievements-button").style.display = ""
        achievements.push(achievement)
        const achievementParent = document.getElementById(`achievement-${achievement}`)
        if (achievementParent) {
            achievementParent.getElementsByClassName("achievement-title")[0].style.color = "#ffff00"
            if (achievementData[achievement]['goal']) {
                const achievementProgress = achievementParent.getElementsByClassName("achievement-progress")[0]
                const achievementBar = achievementParent.getElementsByClassName("achievement-bar")[0]
                if (achievementProgress) {achievementProgress.remove()}
                if (achievementBar) {achievementBar.remove()}
            }
        }
    }
}

let achievementTableLoaded = false
document.getElementById("achievements-button").addEventListener("click", function() { // For performance reasons, this only generates it on click
    if (achievementTableLoaded === false) {
        achievementTableLoaded = true
        for (const [id, data] of Object.entries(achievementData)) {
            const achievementParent = document.createElement("div")
            achievementParent.className = "achievement-parent"
            achievementParent.id = `achievement-${id}`

            const achievementTitle = document.createElement("div")
            achievementTitle.className = "achievement-title"
            achievementTitle.textContent = achievementData[id]['name']

            const achievementDesc = document.createElement("div")
            achievementDesc.className = "achievement-desc"
            achievementDesc.textContent = achievementData[id]['desc']

            achievementParent.appendChild(achievementTitle)
            achievementParent.appendChild(achievementDesc)
            if (!achievements.includes(id)) {
                if (achievementData[id]['goal']) {
                    if (checkAchievement(id)) {
                        achievementTitle.style.color = "#ffff00"
                    } else {
                        const achievementProgress = document.createElement("div")
                        achievementProgress.className = "achievement-progress"
                        achievementProgress.textContent = `${formatNumber(achievementData[id]['goal'][1]())} / ${formatNumber(achievementData[id]['goal'][0])}`

                        const achievementBar = document.createElement("div")
                        achievementBar.className = "achievement-bar"
                        achievementBar.style.width = `${Math.min(achievementData[id]['goal'][1]() / achievementData[id]['goal'][0] * 100, 100)}%`
                        achievementParent.appendChild(achievementProgress)
                        achievementParent.appendChild(achievementBar)
                    }
                }
            } else {
                achievementTitle.style.color = "#ffff00"
            }

            document.getElementById("achievements-table").appendChild(achievementParent)
        }
    }
})

function updateLevelText(currentXp=xp) {
    document.getElementById("level").textContent = `等级 ${xpToLevel(currentXp)} ${getRank()}`
}

const healthbarTextElement = document.getElementById("healthbar-text")
const healthbarFillElement = document.getElementById("healthbar-fill")
const healthbarFillDamageElement = document.getElementById("healthbar-fill-damage")
const energyBarTextElement = document.getElementById("energy-bar-text")
const energyBarFillElement = document.getElementById("energy-bar-fill")
const xpBarTextElement = document.getElementById("xp-bar-text")
const xpBarFillElement = document.getElementById("xp-bar-fill")
const enemyHealthbarTextElement = document.getElementById("enemy-healthbar-text")
const enemyHealthbarFillElement = document.getElementById("enemy-healthbar-fill")
const enemyHealthbarFillDamageElement = document.getElementById("enemy-healthbar-fill-damage")
function updateBar(bar, change=null) {
    if (bar === "health") {
        healthbarTextElement.textContent = `生命：${formatNumber(health, "round")}/${formatNumber(calcMaxHp(), "round")}`
        healthbarFillElement.style.width = `${health / calcMaxHp() * 100}%`
        if (change !== null) {
            healthbarFillDamageElement.style.left = `${health / calcMaxHp() * 100}%`
            healthbarFillDamageElement.style.width = `${-change / calcMaxHp() * 100}%`
        } else {
            healthbarFillDamageElement.style.width = "0"
        }
    } else if (bar === "energy") {
        energyBarTextElement.textContent = `体力：${Math.round(energy)}/100`
        energyBarFillElement.style.width = `${energy / 100 * 100}%`
    } else if (bar === "xp") {
        xpBarTextElement.textContent = `经验：${formatNumber(xpIntoLevel(xp), "round")}/${formatNumber(xpForLevel(xpToLevel(xp)), "round")}`
        xpBarFillElement.style.width = `${xpIntoLevel(xp) / xpForLevel(xpToLevel(xp)) * 100}%`
        updateLevelText(xp)
    } else if (bar === "enemyHealth") {
        enemyHealthbarTextElement.textContent = `生命：${formatNumber(combatStatus['enemyHealth'], "round")}/${formatNumber(combatStatus['enemyMaxHealth'], "round")}`
        enemyHealthbarFillElement.style.width = `${combatStatus['enemyHealth'] / combatStatus['enemyMaxHealth'] * 100}%`
        if (change !== null) {
            enemyHealthbarFillDamageElement.style.left = `${combatStatus['enemyHealth'] / combatStatus['enemyMaxHealth'] * 100}%`
            enemyHealthbarFillDamageElement.style.width = `${-change / combatStatus['enemyMaxHealth'] * 100}%`
        } else {
            enemyHealthbarFillDamageElement.style.width = "0"
        }
    }
}

function capitaliseFirst(string) {
    if (window.ARK_WORDS && window.ARK_WORDS[string] !== undefined) {return window.ARK_WORDS[string]}
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function updateBattlestats(statName=null) {
    for (const [stat, value] of Object.entries(battleStats)) {
        if (statName === null || stat === statName) {
            const effectiveStat = value * calcStatModifier(stat)
            const modifierPercentage = effectiveStat / value * 100 - 100
            document.getElementById(`stat-${stat}`).textContent = `${capitaliseFirst(stat)}：${formatNumber(value, "floor")}${Math.round(modifierPercentage) !== 0 ? ` (${(modifierPercentage > 0 ? "+" : "") + modifierPercentage.toFixed(0)}%)` : ""}`
        }
    }
    document.getElementById(`stat-total`).textContent = `总值：${formatNumber(getTotalBattlestats())}`
}

function updateEnemyBattlestats(statName=null) {
    let total = 0
    for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
        total += value
        if (statName === null || stat === statName) {
            const effectiveStat = value * calcEnemyStatDebuff(stat)
            const modifierPercentage = (effectiveStat / value * 100 - 100) || 0
            document.getElementById(`enemy-stat-${stat}`).textContent = `${capitaliseFirst(stat)}：${formatNumber(value, "floor", true)}${Math.round(modifierPercentage) !== 0 ? ` (${(modifierPercentage > 0 ? "+" : "") + modifierPercentage.toFixed(0)}%)` : ""}`
        }
    }
    document.getElementById(`enemy-stat-total`).textContent = `总值：${formatNumber(total, "floor", true)}`
}

function colorGen(hex, text, id=null) {
    return `<span ${id !== null ? `id=${id} ` : ""}style="color:${hex}">${text}</span>`
}

function processingGen() {
    return "<span class=main-processing></span>"
}

function darkenHexColor(hex, percent) {
    hex = hex.replace("#", "")

    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)

    r = Math.max(0, r - (r * percent / 100))
    g = Math.max(0, g - (g * percent / 100))
    b = Math.max(0, b - (b * percent / 100))

    r = Math.round(r).toString(16).padStart(2, "0")
    g = Math.round(g).toString(16).padStart(2, "0")
    b = Math.round(b).toString(16).padStart(2, "0")
    return `#${r}${g}${b}`
}

document.getElementById("log").addEventListener("scroll", function() {
    const {scrollTop, scrollHeight, clientHeight} = document.getElementById("log")
    logAutoScroll = scrollHeight - scrollTop - clientHeight < 24
})

let logIncrement = 0
function insertLog(content, tooltip=null, id=null, type=null) {
    let div
    if (id !== null && id === logIncrement - 1 && document.getElementById(`log-${id}`)) {
        div = document.getElementById(`log-${id}`)
    } else {
        div = document.createElement("div")
        div.className = "log-entry"
        div.id = `log-${logIncrement}`
        logIncrement += 1

        document.getElementById("log").appendChild(div)

        while (document.getElementById("log").children.length > 200) {
            const removed = document.getElementById("log").firstChild
            document.getElementById("log").removeChild(removed)
        }
    }

    if (content.includes("<")) {
        div.innerHTML = content
    } else {
        div.textContent = content
    }

    if (tooltip !== null) {
        div.setAttribute("data-tooltip-title", tooltip[0])
        div.setAttribute("data-tooltip-text", tooltip[1])
    }

    if (logAutoScroll) {document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight}

    if (itemLogStackData['id'] !== null && (id === null || type === "training")) {
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
    }
    return logIncrement - 1
}

function playTransition() {
    if (settings['sceneTransitions'] === false) {return}
    let transition = document.getElementById("main-transition")
    transition.style.zIndex = 2
    transition.style.opacity = 0
    setTimeout(function() {
        transition.style.zIndex = 0
        transition.style.opacity = 1
    }, 300)
}

function randomRange(min, max, decimals=-1) {
    const value = Math.random() * (max - min) + min
    if (decimals === -1) {return value}
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
}

function generateEnemy(enemyName, stats=null) {
    if (combatStatus['enemy'] !== null) {return}
    combatStatus['enemy'] = enemyName
    const enemy = stats || enemyData[enemyName]
    combatStatus['enemyProperties'] = enemy['properties']
    let healthRoll = enemy['health'] ?? 0
    if (Array.isArray(enemy['health'])) {
        healthRoll = randomRange(enemy['health'][0], enemy['health'][1], 0)
        combatStatus['enemyMaxHealth'] = healthRoll
    } else {
        if (!enemy['maxHealth']) {
            combatStatus['enemyMaxHealth'] = enemy['health']
        } else {
            combatStatus['enemyMaxHealth'] = enemy['maxHealth']
        }
    }
    combatStatus['enemyHealth'] = healthRoll

    for (const stat of statTypes) {
        if (Array.isArray(enemy[stat])) {
            combatStatus['enemyStats'][stat] = randomRange(enemy[stat][0], enemy[stat][1], 2)
        } else {
            combatStatus['enemyStats'][stat] = enemy[stat]
        }
    }
    updateEnemyBattlestats()

    document.getElementById("enemy-name").textContent = enemy['name'] || enemyData[enemyName]['name']
    updateBar("enemyHealth")

    document.getElementById("attack-info-left").style.display = ""
    document.getElementById("attack-info-divider").style.display = ""
    document.getElementById("attack-info-right").style.display = ""
    if (settings['mobileLayout']) {
        document.getElementById("attack-info").style.display = "block"
        document.getElementById("center").style.bottom = "225px"
    }
}

function endFight() {
    combatStatus['enemy'] = null
    combatStatus['enemyHealth'] = 0
    combatStatus['enemyMaxHealth'] = 0
    combatStatus['enemyProperties'] = []
    combatStatus['enemyStats'] = {
        "str": 0,
        "def": 0,
        "spd": 0,
        "dex": 0
    }
    combatStatus['onDeath'] = undefined
    for (const [effect, value] of Object.entries(combatStatus['enemyEffects'] || {})) {
        changeEnemyEffect(effect, null)
    }
    combatStatus['enemyEffects'] = {}
    combatStatus['tags'] = undefined

    document.getElementById("enemy-name").textContent = ""
    updateBar("enemyHealth")

    document.getElementById("attack-info-left").style.display = "none"
    document.getElementById("attack-info-divider").style.display = "none"
    document.getElementById("attack-info-right").style.display = "none"
    if (settings['mobileLayout']) {
        document.getElementById("attack-info").style.display = ""
        document.getElementById("center").style.bottom = ""
    }
}

function killEnemy() {
    insertLog(colorGen("#aaaaaa", `${enemyData[combatStatus['enemy']]['name']} 死了`))

    if (enemyData[combatStatus['enemy']]['loot'] !== undefined) {
        for (const drop of enemyData[combatStatus['enemy']]['loot']) {
            changeInventory(drop['item'], getRandomItem(drop['chances']))
        }
    }

    if (enemyData[combatStatus['enemy']]['xp'] !== undefined) {
        let xpGain = 0
        if (Array.isArray(enemyData[combatStatus['enemy']]['xp'])) {
            xpGain = Math.round(randomRange(enemyData[combatStatus['enemy']]['xp'][0], enemyData[combatStatus['enemy']]['xp'][1], 2))
        } else {
            xpGain = enemyData[combatStatus['enemy']]['xp']
        }
        changeXp(xpGain)
    }

    changeQuestProgress("kills", combatStatus['enemy'], 1)

    if (!stats['kills']) {stats['kills'] = {}}
    stats['kills'][combatStatus['enemy']] = (stats['kills'][combatStatus['enemy']] ?? 0) + 1
    stats['totalKills'] = (stats['totalKills'] ?? 0) + 1
    checkAchievements(["firstBlood", "hunter", "killer", "exterminator"])

    if (combatStatus['onDeath']) {
        onDeathFunctions.get(combatStatus['onDeath'])()
    }

    endFight()
}

function getBaseDamage(strength) {
    const x = Math.log10(Math.max(1, strength))
    return 7 * x ** 2 + x * 2 + 5
}

function calcDamageMitigation(strength, defense) {
    const ratio = defense / strength

    if (ratio >= 14) {return 1}
    if (ratio >= 1 && ratio < 14) {return (50 + (50 / Math.log(14)) * Math.log(ratio)) / 100}
    if (ratio > 1 / 32 && ratio < 1) {return (50 + (50 / Math.log(32)) * Math.log(ratio)) / 100}

    return 0
}

function calcHitChance(speed, dexterity) {
    const ratio = speed / dexterity

    if (ratio > 64) {return 100}
    if (ratio >= 1 && ratio < 64) {return 100 - (50 / 7) * (8 * Math.sqrt(1 / ratio) - 1)}
    if (ratio > 1 / 64 && ratio < 1) {return (50 / 7) * (8 * Math.sqrt(ratio) - 1)}

    return 0
}

function calcArmorMitigation(damage, armor) {
    if (damage <= 0) {return 0.75}
    if (armor <= 0) {return 0}

    const limited = Math.min(Math.log10(armor + 4) / 2, 1)
    const effectiveArmor = (damage * Math.sqrt(armor / damage)) * (0.25 + 0.75 * limited)
    const mitigation = effectiveArmor / (effectiveArmor + damage)

    return Math.min(mitigation, 0.2 + Math.min(Math.log10(armor + 4) / 3, 1) * 0.55)
}

function changeSkill(skill, skillXp) {
    if (skillData[skill] === undefined) {
        insertLog(colorGen("#ff0000", `尝试修改了无效技能 "${skill}"`))
        return
    }
    const scaling = skillData[skill]['scaling']
    const currentLevel = xpToLevel(skills[skill] || 0, false, scaling)


    if (!Number.isInteger(skillXp)) {
        insertLog(colorGen("#ff0000", `尝试以无效数值修改技能 "${skill}" (${skillXp})`))
        if (Number.isFinite(skillXp)) {
            skillXp = Math.floor(skillXp)
        } else {
            return
        }
    }

    if (skills[skill] === undefined) {
        skills[skill] = skillXp
        const skillbarParent = document.createElement("div")
        skillbarParent.className = "skillbar-parent"
        skillbarParent.id = `skill-${skill}`
        skillbarParent.setAttribute("data-tooltip-title", skillData[skill]['name'])
        skillbarParent.setAttribute("data-tooltip-text", skillData[skill]['desc'])

        const skillbarFill = document.createElement("div")
        skillbarFill.className = "skillbar-fill"
        skillbarFill.style.width = `${xpIntoLevel(skills[skill], scaling) / xpForLevel(xpToLevel(skills[skill], false, scaling), scaling) * 100}%`

        const skillbarText = document.createElement("div")
        skillbarText.className = "skillbar-text"
        skillbarText.textContent = `${skillData[skill]['shortName'] || skillData[skill]['name']} ${xpToLevel(skills[skill], false, scaling)}：${formatNumber(xpIntoLevel(skills[skill], scaling), "floorAbove1k")}/${formatNumber(xpForLevel(xpToLevel(skills[skill], false, scaling), scaling), "floorAbove1k")}`

        skillbarParent.appendChild(skillbarFill)
        skillbarParent.appendChild(skillbarText)
        document.getElementById("skill-table").appendChild(skillbarParent)
        
        checkAchievement("skilled")
    } else {
        skills[skill] += skillXp
        const skillbarFill = document.getElementById(`skill-${skill}`).getElementsByClassName("skillbar-fill")[0]
        skillbarFill.style.width = `${xpIntoLevel(skills[skill], scaling) / xpForLevel(xpToLevel(skills[skill], false, scaling), scaling) * 100}%`

        const skillbarText = document.getElementById(`skill-${skill}`).getElementsByClassName("skillbar-text")[0]
        skillbarText.textContent = `${skillData[skill]['shortName'] || skillData[skill]['name']} ${xpToLevel(skills[skill], false, scaling)}：${formatNumber(xpIntoLevel(skills[skill], scaling), "floorAbove1k")}/${formatNumber(xpForLevel(xpToLevel(skills[skill], false, scaling), scaling), "floorAbove1k")}`
    }

    if (currentLevel < xpToLevel(skills[skill], false, scaling)) {
        insertLog(colorGen("#bbbb44", `${skillData[skill]['name']} 提升至 ${xpToLevel(skills[skill], false, scaling)}`))
    }

    if (skillData[skill]['levelExec']) {
        skillData[skill]['levelExec'](xpToLevel(skills[skill], false, scaling))
    }
}

function formatNumber(num, round=false, lowPrecision=false) {
    if (!isFinite(num)) {return "inf"}

    const sign = num < 0 ? "-" : ""
    num = Math.abs(num)

    const units = ["", "k", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No"]
    const exp = Math.max(0, Math.floor(Math.log10(num) / 3))

    if (exp >= units.length) {
        return sign + num.toExponential(2).replace("+", "")
    }

    const value = num / 1000 ** exp
    let decimals
    if (lowPrecision === false) {
        decimals = value < 1 ? 3 : value < 10 ? 2 : value < 100 ? 1 : 0
    } else {
        decimals = value < 1 ? 2 : value < 10 ? 1 : 0
    }

    if (round === "floor" || (round === "floorAbove1k" && num >= 1000)) {
        const factor = 10 ** decimals
        const floored = Math.floor(value * factor) / factor
        return sign + floored.toFixed(decimals).replace(/\.0+$/, "") + units[exp]
    } else if (round === "round" || round === "floorAbove1k") {
        return sign + Number(value.toFixed().replace(/\.0+$/, "")) + units[exp]
    } else {
        return sign + Number(value.toFixed(decimals).replace(/\.0+$/, "")) + units[exp]
    }
}

function englishifyNumber(n) {
    if (window.ARK_LANG && window.ARK_LANG !== "en") {return String(n)}
    const special = ["zeroth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"]
    const deca = ["twent", "thirt", "fort", "fift", "sixt", "sevent", "eight", "ninet"]
    if (n < 20) {return special[n]}
    if (n % 10 === 0) {return deca[Math.floor(n / 10) - 2] + "ieth"}
    return deca[Math.floor(n / 10) - 2] + "y-" + special[n % 10]
}

function formatString(string, values) {
    return string.replace(/\$\{(\w+)\}/g, (_, key) => values[key])
}

function getMovementSpeed() {
    let inventoryMulti = 1
    if (inventoryWeight > 0) {
        inventoryMulti = Math.min(getMaxWeight() / inventoryWeight, 1)
    }
    return (50 + getSkillLevel("walking") * 3) * inventoryMulti * calcEnergyDebuff()
}

function updateArrival(method="travel") {
    const arrivalElem = document.getElementById("text-arrival")
    if (arrivalElem) {
        if (method === "travel" && travelStatus['destination']) {
            const arrival = travelStatus['backwards'] !== true ? Math.ceil(time + Number(travelStatus['distance'] - travelStatus['completed']) / getMovementSpeed()) : Math.ceil(time + Number(travelStatus['completed']) / getMovementSpeed())
            arrivalElem.textContent = formatTime(arrival, true)
        } else if (method === "craft" && craftStatus['recipe']) {
            let craftingType = itemData[craftStatus['recipe']]['crafting']['type']
            let arrival
            if (craftingType === undefined) {
                arrival = Math.ceil(time + Number(craftStatus['goal'] - craftStatus['completed']) / getCraftingSpeed())
            } else {
                arrival = Math.ceil(time + Number(craftStatus['goal'] - craftStatus['completed']) / getAlchemySpeed())
            }
            arrivalElem.textContent = formatTime(arrival, true)
        }
    }
}

function getRandomItem(weightedDict) {
    const totalWeight = Object.values(weightedDict).reduce((sum, weight) => sum + weight, 0)
    
    let randomNum = Math.random() * totalWeight
    
    for (let item in weightedDict) {
        randomNum -= weightedDict[item]
        
        if (randomNum <= 0) {
            return isFinite(item) ? Number(item) : item
        }
    }
}

function createItemDiv(item, type="inventory", stackable=true, increment=null, special={}) {
    const isInventory = type === "inventory"

    const idPrefix = isInventory ? "item" : "storage-item"
    const quantitySource = isInventory ? inventory : storage

    const itemParent = document.createElement("div")
    itemParent.className = "item-parent"
    itemParent.id = stackable ? `${idPrefix}-${item}` : `${idPrefix}-${item}_${increment}`
    itemParent.setAttribute("data-tooltip-title", itemData[item]['name'])
    itemParent.setAttribute("data-tooltip-text", itemData[item]['desc'])
    itemParent.setAttribute("data-class", itemData[item]['class'])
    if (itemData[item]['equipment']) {
        itemParent.setAttribute("data-tooltip-special", "equipment")
    } else {
        itemParent.setAttribute("data-tooltip-special", "item")
    }

    const itemText = document.createElement("span")
    itemText.className = "item-text"
    itemText.textContent = itemData[item]['name']
    itemText.style.color = itemClasses[itemData[item]['class']]

    itemParent.appendChild(itemText)

    if (stackable) {
        const itemQuantity = document.createElement("span")
        itemQuantity.className = "item-quantity"
        itemQuantity.textContent = `x${quantitySource[item]}`
        itemParent.appendChild(itemQuantity)
    }
    const targetTable = special['fragment'] ? special['fragment'] : document.getElementById(isInventory ? "inventory-table" : "storage-table")
    if (special['fragment'] === undefined) {
        for (const child of targetTable.children) {
            if (itemData[item]['class'] < child.getAttribute("data-class") || (itemData[item]['class'] === child.getAttribute("data-class") && itemData[item]['name'] < child.getAttribute("data-tooltip-title"))) {
                targetTable.insertBefore(itemParent, child)
                return
            }
        }
    }
    targetTable.appendChild(itemParent)
}

function genItemLogText(item, amount) {
    return `${amount !== undefined ? colorGen("#ccccff", `x${Math.abs(amount)} `) : ""}${colorGen(itemClasses[itemData[item]['class']], itemData[item]['name'])}`
}

let itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
const inventoryWeightElement = document.getElementById("inventory-weight")
function changeInventory(item, amount, itemId=null, newItemData=null, special={}) {
    let success = true
    if (!itemData[item]) {
        insertLog(colorGen("#ff0000", `尝试创建了无效物品 "${item}"`))
        return false
    }
    if (!Number.isInteger(amount)) {
        insertLog(colorGen("#ff0000", `尝试修改了无效物品 "${item}" (${amount})`))
        if (Number.isFinite(amount)) {
            amount = Math.floor(amount)
        } else {
            return false
        }
    }

    if (itemData[item]['weight'] && special['ignoreWeightLimit'] !== true && itemData[item]['ignoreWeightLimit'] !== true && itemData[item]['weight'] * amount + inventoryWeight > getMaxWeight() * 3 && amount >= 1) {
        insertLog(colorGen("#ccaaaa", `你带不动 ${itemData[item]['name']}`))
        return false
    }

    if (itemData[item]['stackable'] !== false) {
        if (inventory[item] === undefined) {
            if (amount <= 0) {return false}
            inventory[item] = amount
            createItemDiv(item, "inventory", true, null, {"fragment": special['fragment']})
        } else {
            if (inventory[item] + amount < 0) {return false}
            inventory[item] += amount

            if (inventory[item] === 0) {
                delete inventory[item]
                document.getElementById(`item-${item}`).remove()
            } else {
                document.getElementById(`item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${inventory[item]}`
            }
        }
        changeQuestProgress("items", item, inventory[item] ?? 0)
        if ((inventory[item] ?? 0) >= 200) {
            giveAchievement("hoarder")
        }
    } else {
        if (amount === 1) {
            if (newItemData === null) {
                newItemData = {"name": item}
                const itemEquipmentData = itemData[item]['equipment']
                if (itemEquipmentData) {
                    if (itemData[item]['durability']) {
                        newItemData['durability'] = randomRange(itemData[item]['durability'][0], itemData[item]['durability'][1], 0)
                        newItemData['maxDurability'] = newItemData['durability']
                    }
                    if (itemEquipmentData['class'] === "weapon") {
                        newItemData['damage'] = randomRange(itemEquipmentData['damage'][0], itemEquipmentData['damage'][1], 2)
                    }
                    if (itemEquipmentData['armor']) {
                        newItemData['armor'] = randomRange(itemEquipmentData['armor'][0], itemEquipmentData['armor'][1], 2)
                    }
                }
            }

            if (itemId === null) {
                inventoryNonStackable[inventoryNonStackableIncrement] = newItemData
                inventoryNonStackableIncrement += 1
                createItemDiv(item, "inventory", false, inventoryNonStackableIncrement - 1, {"fragment": special['fragment']})
            } else {
                inventoryNonStackable[itemId] = newItemData
                createItemDiv(item, "inventory", false, itemId, {"fragment": special['fragment']})
            }
        } else {
            if (itemData[item]['equipment']) {
                const itemClass = itemData[item]['equipment']['class']
                if (itemClass === "accessory") {
                    if (equipment['accessory1'] !== null && itemId === equipment['accessory1'][1]) {
                        changeEquipment(itemId)
                    }
                    if (equipment['accessory2'] !== null && itemId === equipment['accessory2'][1]) {
                        changeEquipment(itemId)
                    }
                } else {
                    if (equipment[itemClass] !== null && itemId === equipment[itemClass][1]) {
                        changeEquipment(itemId)
                    }
                }
            }
            delete inventoryNonStackable[itemId]
            document.getElementById(`item-${item}_${itemId}`).remove()
        }
    }

    if (itemLogStackData['item'] !== item) {
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
    }
    if (amount > 0) {
        if (itemLogStackData['type'] !== "obtain") {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`获得 ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
        itemLogStackData['type'] = "obtain"
    } else if (special['announceReduction'] === true) {
        if (itemLogStackData['type'] !== "use") {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`使用 ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
        itemLogStackData['type'] = "use"
    }
    itemLogStackData['item'] = item

    if (itemData[item]['weight']) {
        const maxWeight = getMaxWeight()
        inventoryWeight += itemData[item]['weight'] * amount
        inventoryWeightElement.textContent = `${formatNumber(Math.max(inventoryWeight, 0))}g / ${formatNumber(maxWeight)}g`
        if (inventoryWeight > maxWeight * 3) {
            inventoryWeightElement.style.color = "#ff0000"
        } else if (inventoryWeight > maxWeight * 2) {
            inventoryWeightElement.style.color = "#ff8800"
        } else if (inventoryWeight > maxWeight) {
            inventoryWeightElement.style.color = "#ffff00"
        } else {
            inventoryWeightElement.style.color = ""
        }
    }

    if (itemData[item]['obtainExecute']) {
        itemData[item]['obtainExecute'](amount)
    }

    if (stats['discoveredItems'] === undefined) {
        stats['discoveredItems'] = []
    }

    if (!stats['discoveredItems'].includes(item)) {
        stats['discoveredItems'].push(item)
        insertLog(`${colorGen("#ffff00", "新物品：")} ${genItemLogText(item)}`, [itemData[item]['name'], itemData[item]['desc']])
        checkAchievement("collector")
    }

    return success
}

function discoverRecipe(recipe) {
    if (!knownRecipes.includes(recipe)) {
        knownRecipes.push(recipe)
        giveAchievement("discovery")
        insertLog(`新配方：${genItemLogText(recipe)}`, [itemData[recipe]['name'], itemData[recipe]['desc']])
    }
}

function generateStorageMenu() {
    const storageTable = document.createElement("div")
    storageTable.id = "storage-table"
    mainElement.appendChild(storageTable)
    for (const [item, amount] of Object.entries(storage)) {
        createItemDiv(item, "storage")
    }
    for (const [id, data] of Object.entries(storageNonStackable)) {
        const item = data['name']
        createItemDiv(item, "storage", false, id)
    }
}

function changeStorage(item, amount, itemId=null, newItemData=null, announce=true) {
    if (!itemData[item]) {
        insertLog(colorGen("#ff0000", `尝试创建了无效物品 "${item}"`))
        return
    }
    if (!Number.isInteger(amount)) {
        insertLog(colorGen("#ff0000", `尝试修改了无效物品 "${item}" (${amount})`))
        if (Number.isFinite(amount)) {
            amount = Math.floor(amount)
        } else {
            return
        }
    }

    if (itemData[item]['stackable'] !== false) {
        if (storage[item] === undefined) {
            if (amount <= 0) {return false}
            storage[item] = amount
            if (storageAccess) {createItemDiv(item, "storage")}
        } else {
            if (storage[item] + amount < 0) {return false}
            storage[item] += amount

            if (storage[item] === 0) {
                delete storage[item]
                document.getElementById(`storage-item-${item}`).remove()
            } else {
                document.getElementById(`storage-item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${storage[item]}`
            }
        }
    } else {
        if (amount === 1) {
            storageNonStackable[itemId] = newItemData
            if (storageAccess) {createItemDiv(item, "storage", false, itemId)}
        } else {
            delete storageNonStackable[itemId]
            document.getElementById(`storage-item-${item}_${itemId}`).remove()
        }
    }
    if (amount > 0 && announce === true) {
        if (itemLogStackData['type'] !== "deposit" || itemLogStackData['item'] !== item) {
            itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
        }
        itemLogStackData['amount'] += amount
        itemLogStackData['id'] = insertLog(`存入 ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
        itemLogStackData['type'] = "deposit"
        itemLogStackData['item'] = item
    }
}

function changeXp(amount) {
    const currentLevel = xpToLevel(xp)
    xp += amount
    updateBar("xp")
    updateLevelText(xp)
    insertLog(colorGen("#6666ff", `+${amount} 经验`))
    if (currentLevel < xpToLevel(xp)) {
        changeHealth(calcMaxHp() - calcMaxHp(currentLevel))
        updateBar("health")
        insertLog(colorGen("#88ccff", `升级至 ${xpToLevel(xp)}`))
    }
}

function getSkillLevel(skill) {
    if (skills[skill] === undefined) {
        return 0
    } else {
        return xpToLevel(skills[skill], false, skillData[skill]['scaling'])
    }
}

function itemClickDetector(e, isStorage=false) {
    let item = undefined
    let itemId = undefined
    if (isStorage === false) {
        if (e.target.id.startsWith("item-")) {
            item = e.target.id.replace("item-", "")
        } else if (e.target.parentElement.id.startsWith("item-")) {
            item = e.target.parentElement.id.replace("item-", "")
        }
    } else if (isStorage === true) {
        if (e.target.id.startsWith("storage-item-")) {
            item = e.target.id.replace("storage-item-", "")
        } else if (e.target.parentElement.id.startsWith("storage-item-")) {
            item = e.target.parentElement.id.replace("storage-item-", "")
        }
    }

    if (item.split("_").length === 2) {
        [item, itemId] = item.split("_")
    }

    if (item !== undefined) {
        if (isStorage === false) {
            const moveCount = itemId !== undefined ? 1 : Math.min(inventory[item], moveMulti)
            if (itemId && moveMulti >= 1e9) {
                for (const [id, values] of Object.entries(inventoryNonStackable)) {
                    if (values['name'] === item) {
                        const newItemData = inventoryNonStackable[id]
                        changeInventory(item, -moveCount, id)
                        changeStorage(item, moveCount, id, newItemData)
                    }
                }
            } else {
                const newItemData = inventoryNonStackable[itemId]
                changeInventory(item, -moveCount, itemId)
                changeStorage(item, moveCount, itemId, newItemData)
            }
        } else if (isStorage === true) {
            const moveCount = itemId !== undefined ? 1 : Math.min(storage[item], moveMulti)
            if (itemId && moveMulti >= 1e9) {
                for (const [id, values] of Object.entries(storageNonStackable)) {
                    if (values['name'] === item) {
                        const newItemData = storageNonStackable[id]
                        if (changeInventory(item, moveCount, id, newItemData)) {
                            changeStorage(item, -moveCount, id)
                        }
                    }
                }
            } else {
                const newItemData = storageNonStackable[itemId]
                if (changeInventory(item, moveCount, itemId, newItemData)) {
                    changeStorage(item, -moveCount, itemId)
                }
            }
        }
    }
}

function storageClickDetector(e) {
    itemClickDetector(e, true)
}

function toggleStorageAccess(value) {
    if (value === true) {
        storageAccess = true
        document.getElementById("inventory-table").addEventListener("click", itemClickDetector)
        document.getElementById("storage-table").addEventListener("click", storageClickDetector)
    } else {
        storageAccess = false
        document.getElementById("inventory-table").removeEventListener("click", itemClickDetector)
        document.getElementById("storage-table").removeEventListener("click", storageClickDetector)
    }
}

function getMaxWeight(str=battleStats['str']) {
    return Math.round((5000 + Math.pow((str - 1) / 1000000, 0.3) * 95000) / 1000) * 1000
}

function changeEnergy(amount) {
    let oldenergy = energy
    energy = Math.min(Math.max(energy + amount, 0), 100)
    if (amount < 0 && oldenergy > 35 && energy < 35) {
        insertLog(colorGen("#aaaaaa", "你开始感到疲倦"))
    }

    updateBar("energy")
    if (travelStatus['destination']) {updateArrival()}
    if (craftStatus['recipe']) {updateArrival("craft")}
}

let weather = "clear"
let weatherStartTime = time
const weatherData = {
    "clear": {
        "changes": {
            "sunny": {"chance": 40, "check": function() {return ["morning", "afternoon"].includes(getTimeName())}},
            "foggy": {"chance": function() {return getTimeName() === "night" ? 30 : 8}},
            "overcast": {"chance": 15},
            "noChange": {"chance": 10000}
        },
        "minTime": 30
    },
    "sunny": {
        "changes": {
            "clear": {"chance": 40},
            "noChange": {"chance": 10000}
        },
        "minTime": 30,
        "terminate": function() {return !["morning", "afternoon"].includes(getTimeName())}
    },
    "foggy": {
        "changes": {
            "clear": {"chance": 100},
            "noChange": {"chance": 10000}
        },
        "minTime": 20
    },
    "overcast": {
        "changes": {
            "clear": {"chance": 100},
            "rain": {"chance": 200},
            "noChange": {"chance": 10000}
        },
        "minTime": 5
    },
    "rain": {
        "changes": {
            "clear": {"chance": 100},
            "overcast": {"chance": 25},
            "noChange": {"chance": 10000}
        },
        "minTime": 10
    }
}
const weatherAppearance = {
    "clear": {"name": "晴", "color": "#bbbbbb"},
    "sunny": {"name": "晴朗", "color": "#ffcc00"},
    "foggy": {"name": "有雾", "color": "#777777", "tooltip": "速度降低 25%"},
    "overcast": {"name": "阴天", "color": "#7777aa"},
    "rain": {"name": "下雨", "color": "#5555ff"}
}

function processWeatherWeights(changes, multi=1) {
    const weights = {}

    for (const [weather, data] of Object.entries(changes)) {
        if (data['check'] && !data['check']()) {continue}

        weights[weather] = typeof data['chance'] === "function" ? data['chance']() : data['chance']
    }

    if (weights['noChange']) {
        if (multi === 0) {delete weights['noChange']}
        else {weights['noChange'] = weights['noChange'] / multi}
    }

    return weights
}

function getWeatherChances(changes, multi=1) {
    const weights = processWeatherWeights(changes, multi)
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
    const chances = {}

    for (const [weather, weight] of Object.entries(weights)) {
        chances[weather] = (weight / totalWeight) * 100
    }

    return chances
}

function getRandomWeather(changes, multi=1) {
    const weights = processWeatherWeights(changes, multi)
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    
    let randomNum = Math.random() * totalWeight
    
    for (let item in weights) {
        randomNum -= weights[item]
        
        if (randomNum <= 0) {
            return item
        }
    }

    return "noChange"
}

function changeWeather(newWeather) {
    weather = newWeather
    weatherStartTime = time
    const weatherElem = document.getElementById("weather")
    weatherElem.textContent = weatherAppearance[newWeather]['name']
    weatherElem.style.color = weatherAppearance[newWeather]['color']
    weatherElem.style.backgroundColor = darkenHexColor(weatherAppearance[newWeather]['color'], 70)
    if (weatherAppearance[newWeather]['tooltip']) {
        weatherElem.setAttribute("data-tooltip-title", weatherAppearance[newWeather]['name'])
        weatherElem.setAttribute("data-tooltip-text", weatherAppearance[newWeather]['tooltip'])
    } else {
        weatherElem.removeAttribute("data-tooltip-title")
        weatherElem.removeAttribute("data-tooltip-text")
    }
}

function updateWeather(multi=1) {
    const weatherState = weatherData[weather]
    if (weatherState['terminate'] && weatherState['terminate']()) {
        changeWeather(getRandomWeather(weatherState['changes'], 0))
    } else if (time - weatherStartTime >= weatherState['minTime']) {
        const newWeather = getRandomWeather(weatherState['changes'], multi)
        if (newWeather !== "noChange") {
            changeWeather(newWeather)
        }
    }

    if (debugEnabled) {
        const chances = getWeatherChances(weatherState['changes'], 1)
        const chances60 = getWeatherChances(weatherState['changes'], 60)
        outputText = ""
        for (const [weather, chance] of Object.entries(chances)) {
            outputText += `${weather}：${chance.toFixed(2)}% (${chances60[weather].toFixed(2)}%)\n`
        }
        document.getElementById("weather-chances").textContent = outputText
    }
}

const timeElement = document.getElementById("time")
function changeTime(amount) {
    const oldTime = time
    time += amount
    if (Math.floor(time / 1440) > Math.floor(oldTime / 1440)) {
        dailyChecks = {}
    }

    stats['gametime'] += amount
    if (currentScene !== "sleep") {
        noSleepTime += amount
        stats['timeAwake'] = (stats['timeAwake'] ?? 0) + amount
        checkAchievement("insomniac")
    } else {
        stats['totalTimeSlept'] = (stats['timeSlept'] ?? 0) + amount
    }

    if (Math.floor((time - amount) / 1440) < Math.floor(time / 1440)) {
        delete checks['arenaParticipated']
    }
    if (sceneProperties[currentScene]) {
        if (sceneProperties[currentScene].includes("outdoors") && weather === "rain") {
            if (!effects['wet'] || effects['wet']['end'] - time < 60) {
                changeEffect("wet", 5)
            }
        }
    }

    if (currentScene !== "sleep") {
        changeEnergy(-0.05 * amount)
        if (noSleepTime >= 1200) {
            changeEnergy(-(noSleepTime - 1200) * 0.0002 * amount)
        }
    }

    for (const effect in effects) {
        const handler = effectFunctions.get(effect)
        if (handler) {handler(amount)}
    }
    updateWeather(amount)
    timeElement.textContent = formatTime(time)
}

function getTimeName() {
    const timeOffset = time % 1440
    if (timeOffset < 360) {return "night"} // 00:00 - 05:59
    else if (timeOffset < 720) {return "morning"} // 06:00 - 11:59
    else if (timeOffset < 1080) {return "afternoon"} // 12:00 - 17:59
    else if (timeOffset < 1260) {return "evening"} // 18:00 - 21:59
    else if (timeOffset < 1440) {return "night"} // 22:00 - 23:59
    else {return "???"}
}

function createEffectElement(effect, type="player") {
    const div = document.createElement("div")

    div.className = "effect-icon"
    div.id = type === "enemy" ? `enemy-effect-${effect}` : `effect-${effect}`
    div.style.backgroundColor = effectData[effect]['color']
    div.setAttribute("data-tooltip-title", effectData[effect]['name'])
    div.setAttribute("data-tooltip-text", effectData[effect]['desc'])
    div.setAttribute("data-tooltip-special", type === "enemy" ? "enemyEffect" : "effect")

    return div
}

// function updateEffectTooltip(elem, effect, type="player") {
//     let data = type === "enemy" ? combatStatus['enemyEffects'][effect] : effects[effect]
//     let text = effectData[effect]['desc']

//     if (!data['indefinite']) {
//         text += `<hr>Ends: ${colorGen("#ccccff", formatTime(data['end'], true))}`
//     }

//     elem.setAttribute("data-tooltip-text", text)
// }

function createEffect(duration, absolute, properties) {
    const effect = {
        "indefinite": duration === 0,
        "end": duration === 0 ? null : (absolute ? duration : duration + time)
    }

    if (properties !== null) {
        effect['properties'] = properties
    }

    return effect
}

function changeEffect(effect, duration=0, absolute=false, properties=null) {
    const effectElem = document.getElementById(`effect-${effect}`)
    const existing = effects[effect]

    if (duration === null) {
        if (!existing) {return}

        delete effects[effect]
        effectElem?.remove()
        return
    } else if (!existing) {
        effects[effect] = createEffect(duration, absolute, properties)

        const div = createEffectElement(effect)
        // updateEffectTooltip(div, effect)
        document.getElementById("effects-bar").appendChild(div)
        return
    } else if (duration === 0) {
        existing['indefinite'] = true
        existing['end'] = null

        if (properties) {existing['properties'] = properties}
    } else {
        existing['indefinite'] = false

        if (absolute) {
            existing['end'] = duration
        } else {
            existing['end'] += duration
        }

        if (properties) {existing['properties'] = properties}
    }

    // updateEffectTooltip(document.getElementById(`effect-${effect}`), effect)
}

function changeEnemyEffect(effect, duration=0, absolute=false) {
    const effectElem = document.getElementById(`enemy-effect-${effect}`)
    const existing = combatStatus['enemyEffects'][effect]

    if (duration === null) {
        if (!existing) {return}

        delete combatStatus['enemyEffects'][effect]
        effectElem?.remove()
        return
    } else if (!existing) {
        combatStatus['enemyEffects'][effect] = createEffect(duration, absolute)

        const div = createEffectElement(effect, "enemy")
        // updateEffectTooltip(div, effect, "enemy")
        document.getElementById("enemy-effects-bar").appendChild(div)
        return
    } else if (duration === 0) {
        existing['indefinite'] = true
        existing['end'] = null
    } else {
        existing['indefinite'] = false

        if (absolute) {
            existing['end'] = duration
        } else {
            existing['end'] += duration
        }
    }

    // updateEffectTooltip(document.getElementById(`enemy-effect-${effect}`), effect, "enemy")
}

function calcEnergyDebuff() {
    if (energy >= 35) {
        return 1
    } else {
        return energy / 70 + 0.5
    }
}

function getEquipmentStatBuff(equipment, stat) {
    if (equipment !== null) {
        const effects = itemData[equipment[0]]['equipment']['effects']
        if (effects === undefined) {return 0}
        if (effects['all']) {
            return effects['all']
        } else if (effects[stat]) {
            return effects[stat]
        }
    }
    return 0
}

function calcStatModifier(stat=null) {
    let multi = 1
    let equipmentEndNegative = 1
    // Increase
    for (const item of Object.values(equipment)) {
        if (item !== null) {
            change = getEquipmentStatBuff(item, stat)
            if (change > 0) {
                multi += change
            } else (
                equipmentEndNegative *= 1 + change
            )
        }
    }

    
    // Decrease
    multi *= equipmentEndNegative

    if (energy < 35) {
        multi *= energy / 70 + 0.5
    }
    if (stat === "spd") {
        if (weather === "foggy") {multi *= 0.75}
    }
    return multi
}

function getStatModifierInfo(stat=null) {
    const data = {
        "positive": [],
        "negative": []
    }
    let equipmentEndNegative = 1
    for (const item of Object.values(equipment)) {
        if (item !== null) {
            change = getEquipmentStatBuff(item, stat)
            if (change > 0) {
                data['positive'].push({"source": itemData[item[0]]['name'], "change": change})
            } else if (change < 0) {
                data['negative'].push({"source": itemData[item[0]]['name'], "change": 1 + change})
            }
        }
    }

    if (energy < 35) {
        data['negative'].push({"source": "体力", "change": energy / 70 + 0.5})
    }
    if (stat === "spd") {
        if (weather === "foggy") {data['negative'].push({"source": "雾天", "change": 0.75})}
    }
    return data
}

function getStatModifierBreakdown(stat) {
    const data = getStatModifierInfo(stat)
    output = []
    for (const effect of data['positive']) {
        output.push(`${colorGen("#00ff00", `+${formatNumber(effect['change'] * 100, false, true)}%`)} ${effect['source']}`)
    }

    for (const effect of data['negative']) {
        output.push(`${colorGen("#ff0000", `-${formatNumber((1 - effect['change']) * 100, false, true)}%`)} ${effect['source']}`)
    }

    const modifierPercentage = calcStatModifier(stat) * 100 - 100
    output.push(`合计：${modifierPercentage > 0 ? "+" : ""}${formatNumber(modifierPercentage)}%`)
    return output.join("\n")
}

function calcEnemyStatDebuff(stat=null) {
    let multi = 1
    if (stat === "spd") {
        if (weather === "foggy") {multi *= 0.75}
    }
    return multi
}

function changeHealth(amount) {
    let oldHealth = health
    health = Math.min(Math.max(health + amount, 0), calcMaxHp())

    if (health <= 0) {
        endFight()
        if (currentScene === "theArenaFight") {
            if (arenaData['round'] >= 2) {
                prependText = `${colorGen("#ffee00", `你获得了 $${arenaStatData[arenaData['round'] - 2]['reward']} 的参赛报酬`)}\n\n`
                changeMoney(arenaStatData[arenaData['round'] - 2]['reward'])
                if (team === "nextLevel") {
                    checks['nextLevelExercisePills'] = Math.round(arenaStatData[arenaData['round'] - 2]['reward'] / 10)
                }
            }
            arenaData = {}
        }
        playTransition()
        if (region === "forest") {
            sceneManager("huntersGuildHeal")
        } else {
            sceneManager("sleep")
        }
        insertLog(colorGen("#ff0000", "你死了！"))
        health = 1
        insertLog(colorGen("#bb4444", `${(-energy / 2).toFixed(0)} 体力`))
        changeEnergy(-energy / 2)

        for (const [effect, value] of Object.entries(effects)) {
            changeEffect(effect, null)
        }

        if (document.visibilityState === "hidden") {
            document.title = "Arkivia | 已死亡"
        }
    }

    updateBar("health", health - oldHealth)
}

function getQuestGoals(questName) {
    let output = {}
    for (const [type, values] of Object.entries(questData[questName]['goals'])) {
        for (const [stat, data] of Object.entries(values)) {
            const questStatData = questData[questName]['goals']?.[type]?.[stat]
            if (output[type] === undefined) {
                output[type] = {}
            }
            if (data['lifetime'] === true) {
                let statValue
                if (type === "stats") {
                    statValue = battleStats[stat]
                } else if (type === "checks" && questStatData['check']) {
                    statValue = questStatData['check']()
                }

                output[type][stat] = {
                    "amount": data['amount'],
                    "completion": statValue
                }
            } else {
                let statValue
                if (!quests[questName]) {
                    statValue = 0
                } else {
                    if (type === "items") {
                        statValue = inventory[stat] || 0
                    } else {
                        statValue = quests[questName]['goals'][type][stat]['completion']
                    }
                }

                output[type][stat] = {
                    "amount": data['amount'],
                    "completion": statValue
                }
            }
        }
    }
    return output
}

const metQuests = {}
function checkCompletion(questName) {
    if (quests[questName] === undefined) {
        return false
    }
    let goals = getQuestGoals(questName)
    for (const [type, values] of Object.entries(goals)) {
        for (const [stat, data] of Object.entries(values)) {
            if (data['amount'] > data['completion']) {
                if (metQuests[questName] === true) {
                    delete metQuests[questName]
                    document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = ""
                }
                return false
            }
        }
    }

    if (!questData[questName]['manualComplete']) {
        delete quests[questName]
        insertLog(`任务完成：${colorGen("#ffff00", `"${questData[questName]['name']}"`)}`)
        if (questData[questName]['repeatable'] === false) {
            completedQuests.push(questName)
        }
        document.getElementById("completed-quests-table").appendChild(document.getElementById(`quest-${questName}`))
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#ffff00"
        document.getElementById("completed-quests-table").style.display = ""
        document.getElementById("completed-quests-header").style.display = ""
    } else if (metQuests[questName] === undefined) {
        insertLog(`任务达成：${colorGen("#bbff00", `"${questData[questName]['name']}"`)}`)
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#bbff00"
        metQuests[questName] = true
    }
}

function giveQuest(questName, complete=false) {
    if (!quests[questName] && complete === false) {
        nonLifetime = {}
        for (const [type, values] of Object.entries(questData[questName]['goals'])) {
            for (const [stat, data] of Object.entries(values)) {
                if (data['lifetime'] !== true) {
                    if (nonLifetime[type] === undefined) {
                        nonLifetime[type] = {}
                    }
                    nonLifetime[type][stat] = {
                        "amount": data['amount'],
                        "completion": 0
                    }
                }
            }
        }
        quests[questName] = {
            "goals": nonLifetime
        }
        insertLog(`接受任务：${colorGen("#ffff00", `"${questData[questName]['name']}"`)}`)
    }
    if (document.getElementById(`quest-${questName}`) === null) {
        if (document.getElementById("quests-button").style.display === "none") {
            document.getElementById("quests-button").style.display = ""
        }
        const questParent = document.createElement("div")
        questParent.className = "quest-parent"
        questParent.id = `quest-${questName}`

        const questTitle = document.createElement("div")
        questTitle.className = "quest-title"
        questTitle.textContent = questData[questName]['name']

        const questDesc = document.createElement("div")
        questDesc.className = "quest-desc"
        questDesc.textContent = questData[questName]['desc']

        const questGoals = document.createElement("div")
        questGoals.className = "quest-goals"
        
        for (const [type, values] of Object.entries(getQuestGoals(questName))) {
            for (const [stat, data] of Object.entries(values)) {
                const questStatData = questData[questName]['goals']?.[type]?.[stat]
                const goalParent = document.createElement("div")
                goalParent.className = "goal-parent"

                const goal = document.createElement("span")
                goal.className = "quest-goal"
                if (type === "kills") {
                    goal.textContent = `${enemyData[stat]['name']}：`
                } else if (type === "stats") {
                    goal.textContent = `${stat.replace("str", "力量").replace("def", "防御").replace("spd", "速度").replace("dex", "敏捷")}：` // Kinda bad but it works for now
                } else if (type === "items") {
                    goal.textContent = `${itemData[stat]['name']}：`
                } else if (type === "checks") {
                    if (questStatData['name'] === undefined) {
                        goal.textContent = `${stat.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}：`
                    } else {
                        goal.textContent = `${questStatData['name']}：`
                    }
                } else {
                    goal.textContent = `${stat}：`
                }

                const goalProgress = document.createElement("span")
                goalProgress.className = "quest-goal-progress"
                goalProgress.id = `quest-${questName}-${stat}`
                if (complete === false) {
                    goalProgress.style.color = data['completion'] < data['amount'] ? "#ff0000" : "#00ff00"
                    goalProgress.textContent = `${formatNumber(data['completion'], "floor")}/${data['amount']}`
                } else {
                    goalProgress.style.color = "#00ff00"
                    goalProgress.textContent = `${formatNumber(data['amount'])}/${data['amount']}`
                }
                
                questGoals.appendChild(goalParent)
                goalParent.appendChild(goal)
                goalParent.appendChild(goalProgress)
            }
        }
        
        questParent.appendChild(questTitle)
        questParent.appendChild(questDesc)
        questParent.appendChild(questGoals)
        document.getElementById("quests-table").appendChild(questParent)
    }

    if (complete === false) {
        checkCompletion(questName)
    } else {
        delete quests[questName]
        if (!completedQuests.includes(questName)) {
            insertLog(`任务完成：${colorGen("#ffff00", `"${questData[questName]['name']}"`)}`)
            if (questData[questName]['repeatable'] === false) {
                completedQuests.push(questName)
            }
        }
        document.getElementById("completed-quests-table").appendChild(document.getElementById(`quest-${questName}`))
        document.getElementById(`quest-${questName}`).getElementsByClassName("quest-title")[0].style.color = "#ffff00"
        document.getElementById("completed-quests-table").style.display = ""
        document.getElementById("completed-quests-header").style.display = ""
    }
}

function changeQuestProgress(type, stat, value=undefined) {
    for (const quest in quests) {
        const questStatData = questData[quest]['goals']?.[type]?.[stat]
        if (questStatData) {
            let newValue
            if (questStatData['lifetime'] === true) {
                if (value === undefined) {
                    newValue = questStatData['check']()
                } else {
                    newValue = value
                }
            } else if (questStatData['lifetime'] === false) {
                newValue = quests[quest]['goals'][type][stat]['completion'] + value
                quests[quest]['goals'][type][stat]['completion'] = newValue
            } else {
                if (type === "items") {
                    newValue = value
                }
            }
            const goalElem = document.getElementById(`quest-${quest}-${stat}`)
            goalElem.textContent = `${formatNumber(newValue, "floor")}/${questStatData['amount']}`
            if (newValue >= questStatData['amount']) {
                checkCompletion(quest)
                goalElem.style.color = "#00ff00"
            } else if (newValue < questStatData['amount']) {
                goalElem.style.color = "#ff0000"
                if (metQuests[quest]) {
                    delete metQuests[quest]
                    document.getElementById(`quest-${quest}`).getElementsByClassName("quest-title")[0].style.color = ""
                }
            }
        }
    }
}

let trainingSession = {
    "logId": null,
    "gain": 0,
    "stat": null
}
function trainingAreaHandler(stat, gymName="none") {
    const gain = changeBattlestat(stat, gyms[gymName][stat])
    changeSkill("training", 1)
    changeTitleXp("athlete", 1)
    changeEnergy(-0.2)
    if (stat !== trainingSession['stat']) {
        trainingSession['stat'] = stat
        trainingSession['logId'] = null
        trainingSession['gain'] = 0
    }
    trainingSession['gain'] += gain
    trainingSession['logId'] = insertLog(`+${formatNumber(trainingSession['gain'])} (+${formatNumber(gain)}/s) ${stat.replace("str", "力量").replace("def", "防御").replace("spd", "速度").replace("dex", "敏捷")}`, null, trainingSession['logId'], "training")
    if (document.visibilityState === "hidden") {
        document.title = `Arkivia | ${capitaliseFirst(stat)} +${formatNumber(trainingSession['gain'], false, true)} (+${formatNumber(gain, false, true)}/s)`
    }

    if (hasEquipment('strangeTrainingCharm')) {
        changeHealth(-4)
    }
}

function calcTrainingModifier(stat=null) {
    let multi = 1
    // Positive
    multi += getSkillLevel("training") * 0.05

    // Booster Multi
    let boosterMulti = 1
    if (effects['exercisePill']) {boosterMulti += 0.5}

    multi *= boosterMulti

    let equipmentMulti = 1
    if (hasEquipment("strangeTrainingCharm")) {equipmentMulti += 0.2}
    
    multi *= equipmentMulti

    // Negative
    if (energy < 35) {
        multi *= energy / 70 + 0.5
    }
    return multi
}

function getTrainingModifierInfo(stat=null) {
    const data = {
        "positive": [],
        "negative": []
    }

    if (getSkillLevel("training") > 0) {
        data['positive'].push({"source": "训练技能", "change": getSkillLevel("training") * 0.05})
    }

    if (effects['exercisePill']) {data['positive'].push({"source": "锻炼药丸", "change": 0.5, "multi": true})}

    if (hasEquipment("strangeTrainingCharm")) {data['positive'].push({"source": "奇异的训练护符", "change": 0.2, "multi": true})}

    if (energy < 35) {
        data['negative'].push({"source": "体力", "change": energy / 70 + 0.5})
    }

    return data
}

function getTrainingModifierBreakdown(stat) {
    const data = getTrainingModifierInfo(stat)
    output = []
    for (const effect of data['positive']) {
        if (!effect['multi']) {
            output.push(`${colorGen("#00ff00", `+${formatNumber(effect['change'] * 100, false, true)}%`)} ${effect['source']}`)
        } else {
            output.push(`${colorGen("#00ff00", `x${formatNumber(effect['change'] + 1, false, true)}`)} ${effect['source']}`)
        }
    }

    for (const effect of data['negative']) {
        output.push(`${colorGen("#ff0000", `-${formatNumber((1 - effect['change']) * 100, false, true)}%`)} ${effect['source']}`)
    }

    const modifierPercentage = calcTrainingModifier(stat) * 100 - 100
    output.push(`合计：${modifierPercentage > 0 ? "+" : ""}${formatNumber(modifierPercentage)}%`)
    return output.join("\n")
}

function changeBattlestat(stat, amount, absolute=false) {
    let multi = absolute === false ? calcTrainingModifier() : 1
    const oldRank = getRank()
    battleStats[stat] += amount * multi
    updateBattlestats(stat)
    changeQuestProgress("stats", stat, battleStats[stat])
    updateLevelText()
    const newRank = getRank()
    if (newRank !== oldRank) {
        insertLog(`评级变化：${colorGen("#88bb00", oldRank)} -> ${colorGen("#88bb00", newRank)}`)
    }
    inventoryWeightElement.textContent = `${formatNumber(inventoryWeight)}g / ${formatNumber(getMaxWeight())}g`
    return amount * multi
}

function generateShop(shopName) {
    let shopItems = {}
    if (!shopStorage[shopName] || shopStorage[shopName]['day'] < getDay(time)) {
        for (const item of shopData[shopName]) {
            if (Math.random() < item['chance'] / 100) {
                shopItems[item['name']] = {
                    "price": randomRange(item['price'][0], item['price'][1], 0),
                    "quantity": randomRange(item['quantity'][0], item['quantity'][1], 0)
                }
            }
        }
    } else {
        shopItems = shopStorage[shopName]['items']
    }
    shopStorage[shopName] = {
        "day": getDay(time),
        "items": shopItems
    }

    const shopHolder = document.createElement("div")
    shopHolder.className = "shop-holder"
    mainElement.appendChild(shopHolder)

    for (const [item, data] of Object.entries(shopItems)) {
        const itemParent = document.createElement("div")
        itemParent.className = "item-parent"
        itemParent.id = `shop-item-${item}`
        itemParent.setAttribute("data-tooltip-title", itemData[item]['name'])
        itemParent.setAttribute("data-tooltip-text", itemData[item]['desc'])

        const itemText = document.createElement("span")
        itemText.className = "item-text"
        itemText.textContent = itemData[item]['name']

        const itemQuantity = document.createElement("span")
        itemQuantity.className = "item-quantity"
        itemQuantity.textContent = `x${data['quantity']}`

        const itemPrice = document.createElement("span")
        itemPrice.className = "item-price"
        itemPrice.textContent = `$${data['price']}`

        itemParent.appendChild(itemText)
        itemParent.appendChild(itemQuantity)
        itemParent.appendChild(itemPrice)
        shopHolder.appendChild(itemParent)
    }

    shopHolder.addEventListener("click", function(e) {
        let item = null
        if (e.target.id.startsWith("shop-item-")) {
            item = e.target.id.replace("shop-item-", "")
        } else if (e.target.parentElement.id.startsWith("shop-item-")) {
            item = e.target.parentElement.id.replace("shop-item-", "")
        }

        if (item !== null) {
            if (shopStorage[shopName]['items'][item]['quantity'] <= 0) {
                insertLog(colorGen("#aaaaaa", "缺货"))
            } else {
                if (money >= shopStorage[shopName]['items'][item]['price']) {
                    if (changeInventory(item, 1)) {
                        changeMoney(-shopStorage[shopName]['items'][item]['price'])
                        shopStorage[shopName]['items'][item]['quantity'] -= 1
                        document.getElementById(`shop-item-${item}`).getElementsByClassName("item-quantity")[0].textContent = `x${shopStorage[shopName]['items'][item]['quantity']}`
                    }
                } else {
                    insertLog(colorGen("#aaaaaa", "金钱不足"))
                }
            }
        }
    })
}

function beginCrafting(item) {
    if (item !== null) {
        let nonstackablesRequired = {}
        let nonstackableCounts = {}
        for (const item of Object.values(inventoryNonStackable)) {
            nonstackableCounts[item['name']] = (nonstackableCounts[item['name']] ?? 0) + 1
        }

        for (const [craftingItem, amount] of Object.entries(itemData[item]['crafting']['materials'])) {
            if (itemData[craftingItem]['stackable'] !== false) {
                if (inventory[craftingItem] < amount || inventory[craftingItem] === undefined) {
                    insertLog(colorGen("#aaaaaa", "材料不足"))
                    return false
                }
            } else {
                if (nonstackableCounts[craftingItem] < amount || nonstackableCounts[craftingItem] === undefined) {
                    insertLog(colorGen("#aaaaaa", "材料不足"))
                    return false
                }
                if (amount >= 1) {
                    nonstackablesRequired[craftingItem] = amount
                }
            }
        }

        if (Object.keys(nonstackablesRequired).length === 0) {
            let craftingType = itemData[item]['crafting']['type']
            let arrival
            if (craftingType === undefined) {
                arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getCraftingSpeed())
            } else if (craftingType === "alchemy") {
                arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getAlchemySpeed())
            }
            craftStatus['completed'] = 0
            craftStatus['goal'] = itemData[item]['crafting']['complexity']
            craftStatus['recipe'] = item
            sceneManager("empty")
            processText(`你正在制作 “${itemData[item]['name']}”，预计完成于 ${colorGen("#ccccff", formatTime(arrival, true), "text-arrival")}${processingGen()}\n\n{取消|table|0|cancelCrafting}`)
            playTransition()
        } else {
            sceneManager("empty")
            let outputString = Object.entries(nonstackablesRequired).map(([item, amount]) => `- x${amount} ${itemData[item]['name']}`).join("\n")
            processText(`选择\n${outputString}\n从背包中选择\n\n{取消|table|0|cancelCrafting}`)
            craftingSelection = true
            craftStatus['required'] = nonstackablesRequired
            craftStatus['selected'] = item
            playTransition()
        }
    }
}

function generateCraftingMenu() {
    const craftingHolder = document.createElement("div")
    craftingHolder.className = "crafting-holder"
    mainElement.appendChild(craftingHolder)

    let nonstackableCounts = {}
    for (const item of Object.values(inventoryNonStackable)) {
        nonstackableCounts[item['name']] = (nonstackableCounts[item['name']] ?? 0) + 1
    }

    for (const item of knownRecipes) {
        const itemParent = document.createElement("div")
        itemParent.className = "crafting-item-parent"
        itemParent.id = `crafting-item-${item}`
        itemParent.setAttribute("data-tooltip-title", itemData[item]['name'])
        itemParent.setAttribute("data-tooltip-text", itemData[item]['desc'])

        const itemHolder = document.createElement("div")
        itemHolder.className = "crafting-item-holder"

        const craftingType = document.createElement("span")
        craftingType.className = "crafting-type"
        if (itemData[item]['crafting']['type'] === undefined) {
            craftingType.textContent = "C"
            craftingType.style.color = "#ffaa55"
            craftingType.setAttribute("data-tooltip-title", "制作")
        } else if (itemData[item]['crafting']['type'] === "alchemy") {
            craftingType.textContent = "A"
            craftingType.style.color = "#aa55aa"
            craftingType.setAttribute("data-tooltip-title", "炼金")
        }

        const itemText = document.createElement("span")
        itemText.className = "item-text"
        itemText.textContent = itemData[item]['name']

        const itemComplexity = document.createElement("span")
        itemComplexity.className = "item-complexity"
        itemComplexity.textContent = itemData[item]['crafting']['complexity']

        const requirementsHolder = document.createElement("div")
        requirementsHolder.className = "crafting-item-requirements"

        let i = 0
        const totalItems = Object.keys(itemData[item]['crafting']['materials']).length
        for (const [craftingItem, amount] of Object.entries(itemData[item]['crafting']['materials'])) {
            const materialElement = document.createElement("span")
            if (amount >= 1) {
                materialElement.textContent = `x${amount} ${itemData[craftingItem]['name']}`
            } else {
                materialElement.textContent = itemData[craftingItem]['name']
            }
            if (inventory[craftingItem] >= amount || nonstackableCounts[craftingItem] >= amount) {
                materialElement.style.color = "#aaffaa"
            }

            requirementsHolder.appendChild(materialElement)

            if (i < totalItems - 1) {
                const dividerElement = document.createElement("span")
                dividerElement.textContent = `, `
                requirementsHolder.appendChild(dividerElement)
            }

            i += 1
        }

        itemHolder.appendChild(craftingType)
        itemHolder.appendChild(itemText)
        itemHolder.appendChild(itemComplexity)
        itemParent.appendChild(itemHolder)
        itemParent.appendChild(requirementsHolder)
        craftingHolder.appendChild(itemParent)
    }

    craftingHolder.addEventListener("click", function(e) {
        let item = e.target.closest("[id^=\"crafting-item-\"]")?.id?.replace("crafting-item-", "")
        beginCrafting(item)
    })
}

function changeMoney(amount) {
    if (!Number.isFinite(amount)) {
        insertLog(colorGen("#ff0000", `尝试以无效金额修改金钱 (${amount})`))
        return
    }
    money += amount
    if (amount > 0) {
        insertLog(`获得 ${colorGen("#cccc55", `$${formatNumber(amount)}`)}`)
    } else {
        insertLog(`花费 ${colorGen("#cccc55", `$${formatNumber(-amount)}`)}`)
    }
    document.getElementById("inventory-money").textContent = `$${formatNumber(money)}`
    checkAchievements(["money1", "money10", "money100"])
}

function getCraftingSpeed() {
    return (1 + (0.05 * getSkillLevel("crafting"))) * calcEnergyDebuff()
}

function getAlchemySpeed() {
    return 1 + (0.05 * getSkillLevel("alchemy"))
}

function getExploreSpeed() {
    return 1 + (0.05 * getSkillLevel("exploration"))
}

function getMiningSpeed() {
    let multi = 1
    if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "pickaxe") {
        if (itemData[equipment['tool'][0]]['equipment']['efficiency']) {
            multi = itemData[equipment['tool'][0]]['equipment']['efficiency']
        }
    }
    return (1 + (0.05 * getSkillLevel("mining"))) * multi * calcEnergyDebuff()
}

function getChoppingSpeed() {
    let multi = 1
    if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "axe") {
        if (itemData[equipment['tool'][0]]['equipment']['efficiency']) {
            multi = itemData[equipment['tool'][0]]['equipment']['efficiency']
        }
    }
    return (1 + (0.05 * getSkillLevel("felling"))) * multi * calcEnergyDebuff()
}

function getHuntingSpeed() {
    return 1 + (0.05 * getSkillLevel("hunting")) * calcEnergyDebuff()
}

function getEquipmentStats(type) {
    if (equipment[type]) {
        return inventoryNonStackable[equipment[type][1]]
    } else {
        return null
    }
}

function changeTitleXp(selectedTitle, amount) {
    titleScores[selectedTitle] = (titleScores[selectedTitle] ?? 0) + amount

    if (amount > 0) {
        for (const title of Object.keys(titleScores)) {
            if (title !== selectedTitle) {
                titleScores[title] *= 0.9999
            }
        }
    }

    const highest = Object.entries(titleScores).reduce((max, current) => current[1] > max[1] ? current : max)
    if (highest[1] >= 50 && playerTitle !== titleData[highest[0]]['name']) {
        changeTitle(titleData[highest[0]]['name'])
    }
}

function startProcess(type, goal, scene=currentScene) {
    if ((processStatus['type'] !== type && processStatus['scene'] !== scene) || processStatus['completed'] >= processStatus['goal']) {
        processStatus['type'] = type
        processStatus['area'] = scene
        processStatus['completed'] = 0
        processStatus['goal'] = goal
    }
}

function stopProcess() {
    processStatus = {
        "type": null,
        "area": null,
        "goal": 0,
        "completed": 0
    }
}

const onDeathFunctions = new Map([
    ["firstTrainingDummy", function() {
        playTransition()
        sceneManager("dojoQuestIntro")
    }],
    ["strawGolem", function() {
        playTransition()
        sceneManager("dojoYard")
        checks['golemMax'] = Math.max(checks['golemMax'] || 0, 1)
        giveAchievement("golemBreaker")
    }],
    ["woodGolem", function() {
        playTransition()
        sceneManager("dojoYard")
        checks['golemMax'] = Math.max(checks['golemMax'] || 0, 2)
    }],
    ["stoneGolem", function() {
        playTransition()
        sceneManager("dojoYard")
        checks['golemMax'] = Math.max(checks['golemMax'] || 0, 3)
    }],
    ["coalGolem", function() {
        playTransition()
        sceneManager("dojoYard")
    }],
    ["arenaWinMatch", function() {
        playTransition()
        arenaData['endTime'] = time + 60
        arenaData['round'] += 1
        sceneManager("theArenaWinMatch")
    }],
    ["forestLayer1Death", function() {
        checks['forestLayer1EnemiesRemaining'] = (checks['forestLayer1EnemiesRemaining'] ?? 100) - 1
        processText(`你正在清理堵住森林小路的敌人。\n${checks['forestLayer1EnemiesRemaining'] || 100} 个敌人残存${processingGen()}\n\n{![stop.png]停止|forestLayer1|0|endFight}`)
        if (checks['forestLayer1EnemiesRemaining'] === 0) {
            prependText = "你已清理掉所有敌人。\n\n"
            playTransition()
            sceneManager("forestLayer1")
        }
        changeQuestProgress("checks", "forestLayer1EnemiesRemaining")
    }],
    ["huntingEnemyDeath", function() {
        checks['huntersGuildMission']['complete'] = true
        playTransition()
        sceneManager("forestLayer1")
    }]
])

const sceneTicks = new Map([
    ["trainingGrounds_str", function() {
        trainingAreaHandler("str", "none")
    }],
    ["trainingGrounds_def", function() {
        trainingAreaHandler("def", "none")
    }],
    ["trainingGrounds_spd", function() {
        trainingAreaHandler("spd", "none")
    }],
    ["trainingGrounds_dex", function() {
        trainingAreaHandler("dex", "none")
    }],
    ["dojo_trainingDummy", function() {
        generateEnemy("strawDummy")
    }],
    ["sleep", function() {
        changeTitleXp("sleeper", 1)
        changeSkill("sleeping", 1)
        changeEnergy(2 + getSkillLevel("sleeping") * 0.1)
        if (noSleepTime >= 1440) {
            noSleepTime = noSleepTime * 0.98
        }
        noSleepTime = Math.max(noSleepTime - 40, 0)
    }],
    ["hospital", function() {
        changeHealth(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
    }],
    ["alley", function() {
        if (!quests['dojoIntro3'] && !completedQuests.includes("dojoIntro3")) {
            return
        }
        generateEnemy("mouse")
    }],
    ["trainingGrounds_nextLevel_str", function() {
        trainingAreaHandler("str", "nextLevel")
    }],
    ["trainingGrounds_nextLevel_def", function() {
        trainingAreaHandler("def", "nextLevel")
    }],
    ["trainingGrounds_nextLevel_spd", function() {
        trainingAreaHandler("spd", "nextLevel")
    }],
    ["trainingGrounds_nextLevel_dex", function() {
        trainingAreaHandler("dex", "nextLevel")
    }],
    ["theArenaWinMatch", function() {
        if (time >= arenaData['endTime']) {
            delete arenaData['endTime']
            playTransition()
            sceneManager("theArenaWalkIn")
        }
    }],
    ["theArenaMedbay", function() {
        changeHealth(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
        if (time >= arenaData['endTime']) {
            delete arenaData['endTime']
            playTransition()
            sceneManager("theArenaWalkIn")
        }
    }],
    ["grassPlains", function() {
        if (travelStatus['destination'] === null && (checks['spawnDelay'] === null || checks['spawnDelay'] <= time)) {
            const rng = Math.random()
            if (rng < 0.75) {
                generateEnemy("greenSlime")
            } else if (rng < 0.9) {
                generateEnemy("blueSlime")
            } else {
                generateEnemy("purpleSlime")
            }
        }
    }],
    ["forestLayer1Clear", function() {
        if (combatStatus['enemy'] === null) {
            const rng = Math.random()
            if (rng < 0.3 && getTimeName() === "night") {generateEnemy("bat")}
            else if (rng < 0.45) {generateEnemy("lizard")}
            else if (rng < 0.9) {generateEnemy("spider")}
            else {generateEnemy("venomousSpider")}

            combatStatus['onDeath'] = "forestLayer1Death"
        }
    }],
    ["huntersGuildHeal", function() {
        if (health < calcMaxHp(xpToLevel(xp)) / 3) {
            changeHealth(Math.round(Math.max(calcMaxHp(xpToLevel(xp)) / 30, 2)))
        }
    }],
    ["forestMine", function() {
        if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "pickaxe") {
            startProcess("mining", randomRange(20, 30, 0))
            processStatus['completed'] += getMiningSpeed()

            if (changeEquipmentDurability("tool", -1)) {
                const actionText = document.getElementById("action-text")
                if (actionText) {
                    actionText.textContent = "采矿需要先装备一把镐子。"
                }
            }

            changeSkill("mining", 1)
            changeTitleXp("miner", 1)
            if (processStatus['completed'] >= processStatus['goal']) {
                startProcess("mining", randomRange(20, 30, 0))
                changeInventory("stone", randomRange(1, 2, 0))
            }
        }
    }],
    ["forestGymBasic_str", function() {
        trainingAreaHandler("str", "forestGymBasic")
    }],
    ["forestGymBasic_def", function() {
        trainingAreaHandler("def", "forestGymBasic")
    }],
    ["forestGymBasic_spd", function() {
        trainingAreaHandler("spd", "forestGymBasic")
    }],
    ["forestGymBasic_dex", function() {
        trainingAreaHandler("dex", "forestGymBasic")
    }],
    ["forestGymAdvanced_str", function() {
        trainingAreaHandler("str", "forestGymAdvanced")
    }],
    ["forestGymAdvanced_def", function() {
        trainingAreaHandler("def", "forestGymAdvanced")
    }],
    ["forestGymAdvanced_spd", function() {
        trainingAreaHandler("spd", "forestGymAdvanced")
    }],
    ["forestGymAdvanced_dex", function() {
        trainingAreaHandler("dex", "forestGymAdvanced")
    }],
    ["forestHunt", function() {
        if (!combatStatus['enemy']) {
            startProcess("hunt", randomRange(20, 30, 0))
            processStatus['completed'] += getHuntingSpeed()
            changeSkill("hunting", 1)
            if (processStatus['completed'] >= processStatus['goal']) {
                generateEnemy(checks['huntersGuildMission']['enemy'], checks['huntersGuildMission']['stats'])
                combatStatus['onDeath'] = "huntingEnemyDeath"
            }
        }
    }]
])

const effectFunctions = new Map([
    ["wet", function(time) {
        changeEnergy(-0.02 * time)
    }],
    ["poison", function(time) {
        effects['poison']['properties']['dmg'] *= effects['poison']['properties']['change']
        insertLog(`你 -> ${colorGen("#ff3333", formatNumber(effects['poison']['properties']['dmg'], "round"))} ${colorGen(effectData['poison']['color'], "(中毒)")}`)
        changeHealth(-effects['poison']['properties']['dmg'])
        if (effects['poison']['properties']['dmg'] < 0.5) {
            changeEffect("poision", null)
        }
    }]
])

const explorePools = {
    "parkExplore": {
        "difficulty": [10, 15],
        "loot": {
            "grass": 4,
            "woodenStick": 1
        }
    },
    "forestLayer1Explore": {
        "difficulty": [15, 20],
        "loot": {
            "wood": 2,
            "woodenStick": 1
        }
    }
}

function processPlayerTurn() {
    changeEnergy(-0.05)
    const effectiveStats = {}
    for (const [stat, value] of Object.entries(battleStats)) {
        effectiveStats[stat] = value * calcStatModifier(stat)
    }
    const enemyEffectiveStats = {}
    for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
        enemyEffectiveStats[stat] = value * calcEnemyStatDebuff(stat)
    }

    let turnDmg = getBaseDamage(effectiveStats['str']) * (Math.random() * 0.4 + 0.8) * (getEquipmentStats("weapon") !== null ? getEquipmentStats("weapon")['damage'] : 1)
    let turnDmgMulti = 1
    turnDmgMulti += getSkillLevel("fighting") * 0.05
    if (equipment['weapon']) {
        turnDmgMulti += getSkillLevel(`${itemData[equipment['weapon'][0]]['subclass']}Mastery`) * 0.03
    } else {
        turnDmgMulti += getSkillLevel("unarmedMastery") * 0.03
    }
    turnDmg = turnDmg * turnDmgMulti

    const turnDmgMitigation = calcDamageMitigation(effectiveStats['str'], enemyEffectiveStats['def'])
    const turnHitChance = calcHitChance(effectiveStats['spd'], enemyEffectiveStats['dex'])
    
    const turnActualDmg = Math.round(turnDmg * (1 - turnDmgMitigation))
    const oldEnemyHealth = combatStatus['enemyHealth']
    if (turnHitChance / 100 > Math.random()) {
        insertLog(`你 -> ${colorGen("#ff3333", turnActualDmg)}`)
        combatStatus['enemyHealth'] -= turnActualDmg
        if (equipment['weapon']) {
            const item = equipment['weapon'][0]
            const itemId = equipment['weapon'][1]
            getEquipmentStats("weapon")['durability'] -= 1
            document.getElementById("equipment-weapon").querySelector(".bar-fill").style.width = `${getEquipmentStats("weapon")['durability'] / getEquipmentStats("weapon")['maxDurability'] * 100}%`
            if (getEquipmentStats("weapon")['durability'] <= 0) {
                insertLog(`${genItemLogText(item, null)} 损坏了`, [itemData[item]['name'], itemData[item]['desc']])
                changeEquipment(itemId)
                changeInventory(item, -1, itemId)
            }

            if (itemData[item]['equipment']['execute']) {
                itemData[item]['equipment']['execute'](turnActualDmg)
            }

            if (skillData[`${itemData[item]['subclass']}Mastery`]) {
                changeSkill(`${itemData[item]['subclass']}Mastery`, 1)
            }
        } else {
            changeSkill("unarmedMastery", 1)
        }
        if (turnActualDmg >= combatStatus['enemyMaxHealth'] * 3) {
            giveAchievement("overkill")
        }
    } else {
        insertLog(colorGen("#aaaaaa", "你落空了"))
    }
    changeSkill("fighting", 1)
    if (combatStatus['enemy'] === "strawDummy") {
        changeTitleXp("disciple", 1)
    } else {
        changeTitleXp("fighter", 1)
    }
    updateBar("enemyHealth", combatStatus['enemyHealth'] - oldEnemyHealth)

    if (combatStatus['enemyHealth'] <= 0) {
        if (oldEnemyHealth >= combatStatus['enemyMaxHealth']) {
            giveAchievement("flatline")
        }
        if (combatStatus['enemyStats']['str'] > 0 && combatStatus['enemyStats']['spd'] > 0) {
            if (combatStatus.tags?.['damagingHits'] === undefined) {
                giveAchievement("untouchable")
            }
            if (health / calcMaxHp() <= 0.05) {
                giveAchievement("survivor")
            }
        }
    }
}

function processEnemyTurn() {
    const effectiveStats = {}
    for (const [stat, value] of Object.entries(battleStats)) {
        effectiveStats[stat] = value * calcStatModifier(stat)
    }
    const enemyEffectiveStats = {}
    for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
        enemyEffectiveStats[stat] = value * calcEnemyStatDebuff(stat)
    }

    if (enemyEffectiveStats['str'] > 0 && enemyEffectiveStats['spd'] > 0 && combatStatus['enemyEffects']['stun'] === undefined) {
        let turnDmg = getBaseDamage(enemyEffectiveStats['str']) * (Math.random() * 0.4 + 0.8)

        const turnDmgMitigation = calcDamageMitigation(enemyEffectiveStats['str'], effectiveStats['def'])
        const turnHitChance = calcHitChance(enemyEffectiveStats['spd'], effectiveStats['dex'])
        const hitPart = getRandomItem({
            "head": 2,
            "chest": 3,
            "arms": 2,
            "legs": 1
        })
        const hitArmor = getEquipmentStats(hitPart)
        const turnArmorMitigation = hitArmor !== null ? calcArmorMitigation(turnDmg, hitArmor['armor']) : 0
        const turnActualDmg = Math.round(turnDmg * (1 - turnDmgMitigation) * (1 - turnArmorMitigation))

        if (turnHitChance / 100 > Math.random()) {
            insertLog(`${enemyData[combatStatus['enemy']]['name']} -> ${colorGen("#ff3333", turnActualDmg)}`)
            if (turnActualDmg >= 1) {
                const tags = (combatStatus['tags'] ??= {})
                tags['damagingHits'] = (tags['damagingHits'] ?? 0) + 1
            }

            if (enemyData[combatStatus['enemy']]['attackExecute']) {
                enemyData[combatStatus['enemy']]['attackExecute'](turnActualDmg)
            }
            changeHealth(-turnActualDmg)
            if (equipment[hitPart]) {
                const item = equipment[hitPart][0]
                const itemId = equipment[hitPart][1]
                getEquipmentStats(hitPart)['durability'] -= 1
                document.getElementById(`equipment-${hitPart}`).querySelector(".bar-fill").style.width = `${getEquipmentStats(hitPart)['durability'] / getEquipmentStats(hitPart)['maxDurability'] * 100}%`
                if (getEquipmentStats(hitPart)['durability'] <= 0) {
                    insertLog(`${genItemLogText(item, null)} 损坏了`, [itemData[item]['name'], itemData[item]['desc']])
                    changeEquipment(itemId)
                    changeInventory(item, -1, itemId)
                }
            }
        } else {
            insertLog(colorGen("#aaaaaa", `${enemyData[combatStatus['enemy']]['name']} 落空了`))
        }
    }
}

function tick() {
    stats['playtime'] += 1
    const oldTime = time
    changeTime(currentScene !== "sleep" ? 1 : 10)
    updateBar("health")

    if (travelStatus['destination'] !== null) {
        travelStatus['completed'] += travelStatus['backwards'] !== true ? getMovementSpeed() : -getMovementSpeed()
        stats['distanceTravelled'] = (stats['distanceTravelled'] ?? 0) + getMovementSpeed()
        checkAchievements(["firstSteps", "walker", "marathon"])
        changeSkill("walking", 1)
        changeTitleXp("walker", 2)
        if ((travelStatus['completed'] >= travelStatus['distance'] && travelStatus['backwards'] !== true) || (travelStatus['completed'] <= 0 && travelStatus['backwards'] === true)) {
            sceneManager(travelStatus['destination'])
            playTransition()
            travelStatus['destination'] = null
            travelStatus['distance'] = 0
            travelStatus['completed'] = 0
            travelStatus['backwards'] = false
        }
    }

    if (craftStatus['recipe'] !== null) {
        let craftingType = itemData[craftStatus['recipe']]['crafting']['type']
        if (craftingType === undefined) {
            craftStatus['completed'] += getCraftingSpeed()
            changeSkill("crafting", 1)
            changeTitleXp("crafter", 2)
        } else if (craftingType === "alchemy") {
            craftStatus['completed'] += getAlchemySpeed()
            changeSkill("alchemy", 1)
            changeTitleXp("alchemist", 2)
        }
        craftStatus['skillXp'] += 1
        if (craftStatus['completed'] >= craftStatus['goal']) {
            playTransition()
            for (const [craftingItem, amount] of Object.entries(itemData[craftStatus['recipe']]['crafting']['materials'])) {
                if (itemData[craftingItem]['stackable'] !== false) {
                    changeInventory(craftingItem, -amount)
                }
            }

            for (const item of craftStatus['using']) {
                changeInventory(inventoryNonStackable[item]['name'], -1, item)
            }

            changeInventory(craftStatus['recipe'], 1, null, null, {"ignoreWeightLimit": true})
            const storedRecipe = craftStatus['recipe']
            craftStatus['recipe'] = null
            craftStatus['completed'] = 0
            craftStatus['goal'] = 0
            craftStatus['using'] = []
            craftStatus['skillXp'] = 0
            giveAchievement("crafter")
            if (!settings['autoRepeatCrafting']) {
                sceneManager("table")
            } else {
                if (beginCrafting(storedRecipe) === false) {
                    sceneManager("table")
                }
            }
        }
    }

    if (explorePools[currentScene] !== undefined) {
        if (exploreStatus['area'] === null || exploreStatus['area'] !== currentScene) {
            exploreStatus['area'] = currentScene
            exploreStatus['goal'] = randomRange(explorePools[currentScene]['difficulty'][0], explorePools[currentScene]['difficulty'][1], 0)
        }
        exploreStatus['completed'] += getExploreSpeed()
        changeSkill("exploration", 1)
        changeTitleXp("seeker", 1)
        if (exploreStatus['completed'] >= exploreStatus['goal']) {
            exploreStatus['completed'] = 0
            exploreStatus['goal'] = randomRange(explorePools[currentScene]['difficulty'][0], explorePools[currentScene]['difficulty'][1], 0)
            changeInventory(getRandomItem(explorePools[currentScene]['loot']), 1)
        }
    }

    for (const [effect, value] of Object.entries(effects)) {
        if (Number.isInteger(value['end'])) {
            if (value['end'] <= time) {
                changeEffect(effect, null)
            }
        }
    }

    // Combat
    if (combatStatus['enemy'] !== null) {
        for (const [effect, value] of Object.entries(combatStatus['enemyEffects'] || {})) {
            if (Number.isInteger(value['end'])) {
                if (value['end'] <= time) {
                    changeEnemyEffect(effect, null)
                }
            }
        }

        const effectiveStats = {}
        for (const [stat, value] of Object.entries(battleStats)) {
            effectiveStats[stat] = value * calcStatModifier(stat)
        }
        const enemyEffectiveStats = {}
        for (const [stat, value] of Object.entries(combatStatus['enemyStats'])) {
            enemyEffectiveStats[stat] = value * calcEnemyStatDebuff(stat)
        }
        const playerFirst = effectiveStats['spd'] >= enemyEffectiveStats['spd']

        if (combatStatus['enemyHealth'] > 0) {
            if (playerFirst) {
                processPlayerTurn()

                if (combatStatus['enemyHealth'] <= 0) {
                    killEnemy()
                } else {
                    processEnemyTurn()
                }
            } else {
                processEnemyTurn()
                if (combatStatus['enemy']) {
                    processPlayerTurn()
                    if (combatStatus['enemyHealth'] <= 0) {
                        killEnemy()
                    }
                }
            }
        } else {
            killEnemy()
        }

        if (document.visibilityState === "hidden") {
            document.title = `Arkivia | 等级${xpToLevel(xp)} (${Math.floor(xpIntoLevel(xp) / xpForLevel(xpToLevel(xp)) * 100)}%) ${formatNumber(health, "round")}hp`
        }

        if (settings['mobileLayout']) {
            document.getElementById("attack-info").style.display = "block"
            document.getElementById("center").style.bottom = "225px"
        }
    } else {
        if (settings['mobileLayout']) {
            document.getElementById("attack-info").style.display = ""
            document.getElementById("center").style.bottom = ""
        }
    }

    if (noSleepTime >= 1200) {
        changeEffect("sleepDeprived")
    } else {
        changeEffect("sleepDeprived", null)
    }

    const handler = sceneTicks.get(currentScene)
    if (handler) {handler()}

    updateBattlestats()
    if (combatStatus['enemy'] !== null) {updateEnemyBattlestats()}

    for (const [action, value] of Object.entries(activeActions)) {
        if (actionData[action]['tick']) {
            actionData[action]['tick']()
        }
    }

    updateTooltip()
}

window.addEventListener("focus", function() {
    document.title = "Arkivia"
})

let tickDelay = 1000
let lastTickTime = performance.now()
function tickLoop() {
    const now = performance.now()
    const elapsed = now - lastTickTime

    if (elapsed >= tickDelay) {
        let missedTicks = Math.min(Math.floor(elapsed / tickDelay), 1000)

        for (let i = 0; i < missedTicks; i++) {
            tick()
        }

        lastTickTime = now - (elapsed % tickDelay)
    }

    setTimeout(tickLoop, Math.max(0, tickDelay - (performance.now() - lastTickTime)))
}
tickLoop()
// setInterval(tick, 1000)

setInterval(function() {
    if (saveEnabled === true && currentScene !== "intro1") {
        saveToLocal(makeSave())
        document.getElementById("last-save").textContent = `上次保存：${new Date().toLocaleTimeString()}`
    }
}, 10000)

document.getElementById("manual-save").addEventListener("click", function() {
    if (saveEnabled === true) {
        saveToLocal(makeSave())
        document.getElementById("last-save").textContent = `上次保存：${new Date().toLocaleTimeString()}`
    }
})

for (const elem of document.getElementById("menu-buttons-holder").children) {
    elem.addEventListener("click", function() {
        for (const elem2 of document.getElementsByClassName("sidebar-menu")) {
            if (elem2.id.replace("sidebar-menu-", "") === elem.id.replace("-button", "")) {
                elem2.style.display = "block"
            } else {
                elem2.style.display = "none"
            }
        }
        for (const elem of document.getElementById("menu-buttons-holder").children) {
            elem.style.borderColor = ""
        }
        elem.style.borderColor = "#7777cc"
    })
}

let activeTarget = null

function updateTooltip() {
    if (activeTarget) {
        const tooltipTitle = activeTarget.getAttribute("data-tooltip-title")
        let tooltipText = activeTarget.getAttribute("data-tooltip-text")
        const tooltipSpecial = activeTarget.getAttribute("data-tooltip-special")
        if (tooltipSpecial === "equipment") {
            const [item, itemId] = activeTarget.id.replace("item-", "").split("_")
            const tooltipItemData = inventoryNonStackable[itemId] || storageNonStackable[itemId]
            if (tooltipItemData !== undefined) {
                tooltipText += "<hr>"
                if (tooltipItemData['damage']) {tooltipText += `伤害：${colorGen("#ff0000", tooltipItemData['damage'])}\n`}
                if (tooltipItemData['durability']) {tooltipText += `耐久：${colorGen("#ffff00", tooltipItemData['durability'])}\n`}
                if (tooltipItemData['armor']) {tooltipText += `护甲：${colorGen("#00ffff", tooltipItemData['armor'])}\n`}
                if (itemData[item]) {tooltipText += `重量：${colorGen("#00ff00", `${formatNumber(itemData[item]['weight'])}g`)}\n`}
            }
        } else if (tooltipSpecial === "stat") {
            const stat = activeTarget.id.replace("stat-", "")
            const statModBreakdown = getStatModifierBreakdown(stat)
            const trainingModBreakdown = getTrainingModifierBreakdown(stat)
            if (statModBreakdown) {
                tooltipText += `<hr><b>属性加成</b>\n${statModBreakdown}`
            }
            if (trainingModBreakdown && trainingModBreakdown !== "合计：0%") {
                tooltipText += `<hr><b>训练加成</b>\n${trainingModBreakdown}`
            }
        } else if (tooltipSpecial === "item") {
            const item = activeTarget.id.replace("item-", "")
            const tooltipItemData = inventory[item] || storage[item]
            if (tooltipItemData !== undefined) {
                tooltipText += "<hr>"
                if (itemData[item]) {tooltipText += `重量：${colorGen("#00ff00", `${formatNumber(itemData[item]['weight'])}g`)}\n`}
            }
        } else if (tooltipSpecial === "effect") {
            const effect = activeTarget.id.replace("effect-", "")
            if (effects[effect] && effects[effect]['end']) {
                tooltipText += `<hr>剩余：${colorGen("#ccccff", effects[effect]['end'] - time)}`
            }
        } else if (tooltipSpecial === "enemyEffect") {
            const effect = activeTarget.id.replace("enemy-effect-", "")
            if (combatStatus['enemyEffects'][effect] && combatStatus['enemyEffects'][effect]['end']) {
                tooltipText += `<hr>剩余：${colorGen("#ccccff", combatStatus['enemyEffects'][effect]['end'] - time)}`
            }
        }

        document.getElementById("tooltip-title").textContent = tooltipTitle

        if (tooltipText && tooltipText.includes("<")) {
            document.getElementById("tooltip-text").innerHTML = tooltipText
        } else {
            document.getElementById("tooltip-text").textContent = tooltipText
        }

        if (tooltipText === undefined) {
            document.getElementById("tooltip-hr").style.display = "none"
        } else {
            document.getElementById("tooltip-hr").style.display = ""
        }
    }
}

const tooltipElement = document.getElementById("tooltip")
document.addEventListener("mouseover", function(e) {
    const elem = e.target.closest("[data-tooltip-title]")
    if (!elem) return
    
    activeTarget = elem
    updateTooltip()

    const offset = 14

    const tooltipWidth = tooltipElement.offsetWidth
    const tooltipHeight = tooltipElement.offsetHeight

    let left = e.clientX + offset
    let top = e.clientY + offset

    if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - offset
    }

    if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - offset
    }

    tooltipElement.style.left = `${left}px`
    tooltipElement.style.top = `${top}px`
    tooltipElement.style.opacity = "1"
})

document.addEventListener("mouseout", function(e) {
    if (activeTarget !== undefined) {
        activeTarget = null
        tooltipElement.style.opacity = "0"
    }
})

document.addEventListener("mousemove", function(e) {
    if (!activeTarget) return

    const offset = 14

    const tooltipWidth = tooltipElement.offsetWidth
    const tooltipHeight = tooltipElement.offsetHeight

    let left = e.clientX + offset
    let top = e.clientY + offset

    if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - offset
    }

    if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - offset
    }

    tooltipElement.style.left = `${left}px`
    tooltipElement.style.top = `${top}px`
})

// Font size calc
const span = document.createElement("span")
span.textContent = "A"
span.style.fontFamily = "monospace"
span.style.fontSize = "16px"
span.style.position = "absolute"
span.style.visibility = "hidden"
document.body.appendChild(span)
const fontCharWidth = span.offsetWidth
document.body.removeChild(span)

function changeEquipment(itemId) {
    const item = inventoryNonStackable[itemId]['name']
    let itemClass = itemData[item]['equipment']['class']
    if (itemClass === "accessory") {
        if ((equipment['accessory1'] === null || equipment['accessory1'][1] === itemId) && (equipment['accessory2'] === null || equipment['accessory2'][1] !== itemId)) {itemClass = "accessory1"}
        else {itemClass = "accessory2"}
    }

    const equipmentElem = document.getElementById(`equipment-${itemClass}`)
    const textElem = equipmentElem.querySelector(".equipment-item-text")
    if (equipment[itemClass] === null || itemId !== equipment[itemClass][1]) {
        if (equipment[itemClass] !== null && itemId !== equipment[itemClass][1]) {
            document.getElementById(`item-${equipment[itemClass][0]}_${equipment[itemClass][1]}`).querySelector(".item-equipped").remove()
            if (itemData[item]['equipment']['unequipExecute']) {itemData[item]['equipment']['unequipExecute']()}
        }
        equipment[itemClass] = [item, itemId]
        if (itemData[item]['name'].length * fontCharWidth > 140) {
            textElem.style.fontSize = `${Math.floor(16 * (144 / (itemData[item]['name'].length * fontCharWidth)))}px`
        }
        textElem.textContent = itemData[item]['name']
        textElem.style.color = "var(--color)"
        equipmentElem.querySelector(".bar-fill").style.width = `${inventoryNonStackable[itemId]['durability'] / inventoryNonStackable[itemId]['maxDurability'] * 100}%`
        const inventorySlot = document.getElementById(`item-${item}_${itemId}`)
        if (inventorySlot) {
            const itemEquipped = document.createElement("span")
            itemEquipped.className = "item-equipped"
            itemEquipped.textContent = "E"

            inventorySlot.appendChild(itemEquipped)
        }

        if (itemData[item]['equipment']['equipExecute']) {itemData[item]['equipment']['equipExecute']()}
    } else {
        equipment[itemClass] = null
        textElem.textContent = equipmentElem.getAttribute("data-tooltip-title")
        textElem.style.fontSize = ""
        textElem.style.color = ""
        equipmentElem.querySelector(".bar-fill").style.width = "0"

        document.getElementById(`item-${item}_${itemId}`).querySelector(".item-equipped").remove()
        if (itemData[item]['equipment']['unequipExecute']) {itemData[item]['equipment']['unequipExecute']()}
    }
}

function hasEquipment(item) {
    const itemClass = itemData[item]?.['equipment']?.['class']
    if (!itemClass) {return false}
    if (itemClass === "accessory") {
        if (equipment['accessory1']?.[0] === item || equipment['accessory2']?.[0] === item) {
            return true
        }
    } else {
        if (equipment[itemClass]?.[0] === item) {
            return true
        }
    }

    return false
}

let moveMulti = 1

function setMulti(newMulti) {
    if (newMulti !== moveMulti) {
        moveMulti = newMulti
        return true
    } else {
        moveMulti = 1
        return false
    }
}

document.getElementById("inventory-10x").addEventListener("click", function() {
    for (const element of document.getElementById("multi-holder").children) {
        element.classList.remove("selected")
    }
    this.classList.toggle("selected", setMulti(10))
})

document.getElementById("inventory-100x").addEventListener("click", function() {
    for (const element of document.getElementById("multi-holder").children) {
        element.classList.remove("selected")
    }
    this.classList.toggle("selected", setMulti(100))
})

document.getElementById("inventory-all").addEventListener("click", function() {
    for (const element of document.getElementById("multi-holder").children) {
        element.classList.remove("selected")
    }
    this.classList.toggle("selected", setMulti(1e9))
})

document.getElementById("inventory-table").addEventListener("click", function(e) {
    if (storageAccess) {return}
    let [item, itemId] = e.target.closest("[id^=\"item-\"]").id.replace("item-", "").split("_")

    if (discardMode === true) {
        if (item !== null) {
            if (itemData[item]['undeletable']) {
                insertLog("这东西也许不该丢掉")
                return
            }
            const deleteCount = itemId !== undefined ? 1 : Math.min(inventory[item], moveMulti)
            changeInventory(item, -deleteCount, itemId)
            if (itemLogStackData['type'] !== "discard" || itemLogStackData['item'] !== item) {
                itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}
            }
            itemLogStackData['amount'] += deleteCount
            itemLogStackData['id'] = insertLog(`丢弃 ${genItemLogText(item, itemLogStackData['amount'])}`, [itemData[item]['name'], itemData[item]['desc']], itemLogStackData['id'])
            itemLogStackData['type'] = "discard"
            itemLogStackData['item'] = item

            stats['itemsDeleted'] = (stats['itemsDeleted'] ?? 0) + deleteCount
            checkAchievement("wasteful")
        }
        return
    }

    if (craftingSelection === true) {
        if (craftStatus['required'][item] !== undefined) {
            const inventorySlot = document.getElementById(`item-${item}_${itemId}`)
            if (!craftStatus['using'].includes(itemId)) {
                if (craftStatus['required'][item] > 0) {
                    if (itemData[item]['equipment']) {
                        if (equipment[itemData[item]['equipment']['class']] !== undefined && equipment[itemData[item]['equipment']['class']] && equipment[itemData[item]['equipment']['class']][1] === itemId) {
                            return
                        }
                    }

                    if (inventorySlot) {
                        const itemSelected = document.createElement("span")
                        itemSelected.className = "item-selected"
                        itemSelected.textContent = "S"

                        inventorySlot.appendChild(itemSelected)
                    }
                    craftStatus['using'].push(itemId)
                    craftStatus['required'][item] -= 1
                }
            } else {
                craftStatus['using'].splice(craftStatus['using'].indexOf(itemId), 1)
                craftStatus['required'][item] += 1
                inventorySlot.getElementsByClassName("item-selected")[0].remove()
            }
            let outputString = Object.entries(craftStatus['required']).filter(([item, amount]) => amount > 0).map(([item, amount]) => `- x${amount} ${itemData[item]['name']}`).join("\n")
            if (outputString !== "") {
                processText(`选择\n${outputString}\n从背包中选择\n\n{取消|table|0|cancelCrafting}`)
            } else {
                processText(`{确认|craftConfirm}\n\n{取消|table|0|cancelCrafting}`)
            }
        }
        return
    }

    if (item !== null) {
        if (itemData[item]['execute']) {
            itemData[item]['execute']()
            changeInventory(item, -1, null, null, {"announceReduction": true})
        } else if (itemData[item]['equipment']) {
            changeEquipment(itemId)
        }
    }
})

document.getElementById("inventory-discard").addEventListener("click", function(e) {
    if (discardMode === false) {
        discardMode = true
        document.getElementById("inventory-discard").style.backgroundColor = "#ff0000"
        document.getElementById("inventory-discard").style.color = "#000000"
        document.getElementById("inventory-table").style.setProperty("--hover-background", "#aa4444")
    } else {
        discardMode = false
        document.getElementById("inventory-discard").style.backgroundColor = ""
        document.getElementById("inventory-discard").style.color = ""
        document.getElementById("inventory-table").style.removeProperty("--hover-background")
    }
})

function getTotalBattlestats() {
    return battleStats['str'] + battleStats['def'] + battleStats['spd'] + battleStats['dex']
}

function changeTitle(newTitle) {
    if (window.ARK_LEGACY_TITLES && window.ARK_LEGACY_TITLES[newTitle] !== undefined) {newTitle = window.ARK_LEGACY_TITLES[newTitle]}
    playerTitle = newTitle
    document.getElementById("title").textContent = playerTitle
    insertLog(`称号变更：${colorGen("#dd8833", `"${playerTitle}"`)}`)
}

function genTrainingAreaText(target) {
    return `{![dumbbells.png]训练力量|${target}_str}\n{![shield.png]训练防御|${target}_def}\n{![treadmill.png]训练速度|${target}_spd}\n{![dexterity.png]训练敏捷|${target}_dex}`
}

function genQuestGiver(checkId, actionTexts, questList) {
    let allComplete = true
    for (let i = 0; i < questList.length; i++) {
        if (!completedQuests.includes(questList[i]['quest'])) {
            allComplete = false
        }
        
        if ((completedQuests.includes(questList[i]['quest']) || metQuests[questList[i]['quest']]) && (questProgression[checkId] === undefined || questProgression[checkId] < i)) {
            const quest = questList[i]

            if (metQuests[quest['quest']]) {
                delete metQuests[quest['quest']]
                giveQuest(quest['quest'], true)
            }

            questProgression[checkId] = i
            if (questList[i + 1] !== undefined && questList[i + 1]['introMessage'] === undefined) {
                giveQuest(questList[i + 1]['quest'])
            }
            if (quest['rewards']) {
                for (const [item, amount] of Object.entries(quest['rewards'])) {
                    changeInventory(item, amount, null, null, {"ignoreWeightLimit": true})
                }
            }
            if (quest['money']) {
                changeMoney(quest['money'])
            }

            if (quest['consumed']) {
                for (const [item, amount] of Object.entries(quest['consumed'])) {
                    changeInventory(item, -amount)
                }
            }

            if (quest['completeExecute']) {
                quest['completeExecute']()
            }

            return quest['message']
        } else if (questList[i]['introMessage'] !== undefined && (questProgression[checkId] === undefined || i <= questProgression[checkId] + 1) && !quests[questList[i]['quest']] && !completedQuests.includes(questList[i]['quest'])) {
            const quest = questList[i]
            if (quest['requirements']) {
                for (const requirement of quest['requirements']) {
                    if (!requirement['check']()) {
                        return requirement['message']
                    }
                }
            }
            giveQuest(quest['quest'])
            return quest['introMessage']
        }
    }
    if (allComplete === false) {
        return actionTexts['none']
    } else {
        return actionTexts['allComplete'] || actionTexts['none']
    }
}

function changeEquipmentDurability(selected, change) {
    const item = equipment[selected][0]
    const itemId = equipment[selected][1]
    getEquipmentStats(selected)['durability'] -= 1
    document.getElementById(`equipment-${selected}`).querySelector(".bar-fill").style.width = `${getEquipmentStats(selected)['durability'] / getEquipmentStats(selected)['maxDurability'] * 100}%`
    if (getEquipmentStats(selected)['durability'] <= 0) {
        insertLog(`${genItemLogText(item)} 损坏了`, [itemData[item]['name'], itemData[item]['desc']])
        changeEquipment(itemId)
        changeInventory(item, -1, itemId)
        return true
    }
}

function changePrependText(text) {
    let prependTextElement = document.getElementById("prepend-text")

    if (text === "" || text === undefined && prependTextElement) {
        currentPrependText = text
        prependTextElement.remove()
        return
    }

    if (prependTextElement === null) {
        prependTextElement = document.createElement("div")
        prependTextElement.id = "prepend-text"
        prependTextElement.className = "main-text"
        mainElement.prepend(prependTextElement)
    }
    if (currentPrependText !== text) {
        currentPrependText = text
        prependTextElement.innerHTML = text
    }
}

let activeActions = {}
const actionData = {
    "chopTrees": {
        "name": "砍树",
        "enable": function() {
            startProcess("chop", randomRange(20, 30, 0))
            changePrependText(`你正在砍树${processingGen()}\n\n`)
        },
        "disable": function() {
            if (processStatus['type'] === "chop") {
                stopProcess()
                changePrependText()
            }
        },
        "tick": function() {
            if (processStatus['type'] === "chop") {
                if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "axe") {
                    changePrependText(`你正在砍树${processingGen()}\n\n`)
                    processStatus['completed'] += getChoppingSpeed()
                    changeEquipmentDurability("tool", -1)

                    changeSkill("felling", 1)
                    changeTitleXp("lumberjack", 1)

                    if (processStatus['completed'] >= processStatus['goal']) {
                        startProcess("chop", randomRange(20, 30, 0))
                        changeInventory("wood", randomRange(1, 2, 0))
                        if (randomRange(1, 10, 0) === 1) {
                            changeInventory("apple", 1)
                        }
                        stats['treesCut'] = (stats['treesCut'] ?? 0) + 1
                        checkAchievement("deforestation")
                    }
                } else {
                    changePrependText(`砍树需要先装备一把斧头。\n\n`)
                }
            }
        }
    }
}

function generateActions() {
    const actions = []
    const possibleActions = []
    if (currentScene === "forestLayer1") {
        if (equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "axe") {
            actions.push("chopTrees")
        } else {
            for (const tool of Object.values(inventoryNonStackable)) {
                if (itemData[tool['name']]['subclass'] === "axe") {
                    possibleActions.push("chopTrees")
                    break
                }
            }
        }
    }

    document.getElementById("center-bottom").replaceChildren()
    if (actions.length >= 1) {
        for (const action of actions) {
            const actionButton = document.createElement("button")
            actionButton.className = "action-button"
            actionButton.textContent = actionData[action]['name']

            actionButton.addEventListener("click", function() {
                if (activeActions[action] === undefined) {
                    activeActions[action] = true
                    actionData[action]['enable']()
                    actionButton.classList.add("enabled")
                } else {
                    delete activeActions[action]
                    actionData[action]['disable']()
                    actionButton.classList.remove("enabled")
                }
            })

            if (activeActions[action]) {
                actionButton.classList.add("enabled")
            }

            document.getElementById("center-bottom").appendChild(actionButton)
        }
    }

    if (possibleActions.length >= 1) {
        for (const action of possibleActions) {
            const actionButton = document.createElement("button")
            actionButton.className = "action-button disabled"
            actionButton.textContent = actionData[action]['name']

            document.getElementById("center-bottom").appendChild(actionButton)
        }
    }
}

const sceneProperties = {
    "housingArea": ["outdoors"],
    "townCenter": ["outdoors"],
    "noticeBoard": ["outdoors"],
    "trainingGrounds": ["outdoors"],
    "trainingGroundsInstructor": ["outdoors"],
    "trainingGroundsInstructor_askStats": ["outdoors"],
    "trainingGrounds_str": ["outdoors"],
    "trainingGrounds_def": ["outdoors"],
    "trainingGrounds_spd": ["outdoors"],
    "trainingGrounds_dex": ["outdoors"],
    "trainingGroundsTeamIntro1": ["outdoors"],
    "dojoYard": ["outdoors"],
    "dojoGolems": ["outdoors"],
    "dojo_golemFight": ["outdoors"],
    "alley": ["outdoors"],
    "townNorth": ["outdoors"],
    "park": ["outdoors"],
    "parkExplore": ["outdoors"],
    "townGatesNorth": ["outdoors"],
    "townGatesNorthExterior": ["outdoors"],
    "grassPlains": ["outdoors"],
    "forestLayer1": ["outdoors"],
    "forestLayer1Explore": ["outdoors"],
    "forestHunt": ["outdoors"],
    "forestLayer1Clear": ["outdoors"],
    "forestLayer2": ["outdoors"],
    "forestMineEntrance": ["outdoors"]
}

const sceneRegions = {
    "intro1": "starterTown",
    "home": "starterTown",
    "sleep": "starterTown",
    "storage": "starterTown",
    "table": "starterTown",
    "housingArea": "starterTown",
    "townCenter": "starterTown",
    "noticeBoard": "starterTown",
    "trainingGrounds": "starterTown",
    "dojo": "starterTown",
    "dojoYard": "starterTown",
    "hospital": "starterTown",
    "alley": "starterTown",
    "merchant": "starterTown",
    "townNorth": "starterTown",
    "park": "starterTown",
    "weaponShop": "starterTown",
    "theArenaEntrance": "starterTown",
    "townGatesNorth": "starterTown",
    "townGatesNorthExterior": "wilderness",
    "grassPlains": "wilderness",
    "forestLayer1": "forest",
    "huntersGuild": "forest",
    "huntersGuildHeal": "forest",
    "forestLayer2": "forest",
    "forestMine": "forest",
    "forestGym": "forest"
}

class scenes {
    static empty() {
        return ``
    }

    static craftConfirm() {
        const item = craftStatus['selected']
        craftStatus['selected'] = null
        craftingSelection = false
        let craftingType = itemData[item]['crafting']['type']
        let arrival
        if (craftingType === undefined) {
            arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getCraftingSpeed())
        } else if (craftingType === "alchemy") {
            arrival = Math.ceil(time + itemData[item]['crafting']['complexity'] / getAlchemySpeed())
        }
        craftStatus['completed'] = 0
        craftStatus['goal'] = itemData[item]['crafting']['complexity']
        craftStatus['recipe'] = item
        return `你正在制作 “${itemData[item]['name']}”，预计完成于 ${colorGen("#ccccff", formatTime(arrival, true))}${processingGen()}\n\n{取消|table|0|cancelCrafting}`
    }

    static intro1() {
        return `“你好？”\n\n{继续|intro2}`
    }

    static intro2() {
        return `“你还好吗？”\n\n{站起来|intro3}`
    }

    static intro3() {
        return `“噢，太好了，你醒了……你可能会有点迷糊，这是正常的。”\n\n{继续|intro4}`
    }

    static intro4() {
        return `“最近发生了一起事件，导致其他维度的人类被传送到了这里。我们还没查明原因，恐怕你暂时只能留在这里了。”\n\n{继续|intro5}`
    }

    static intro5() {
        return `“别担心，我们镇的镇长会为所有受此事件影响的人提供住处。”\n\n{继续|intro6}`
    }

    static intro6() {
        return `“我还有别的人要照看，接下来会有人带你走。”\n\n那人朝一个穿灰色外套、中等身高的男人指了指。\n\n{走向那个男人|intro7}`
    }

    static intro7() {
        return `你走向那个男人。\n\n他简短地点了点头。\n\n“我叫艾伦，我带你去你住的地方。”\n\n{跟着他|intro8}`
    }

    static intro8() {
        return `你跟着艾伦走，直到他停在一栋小木屋前。他示意你进去。\n\n{![enter.png]进去|intro9}`
    }

    static intro9() {
        changeTitle("新来者")
        return `屋子很小。\n\n墙很薄。木地板。一张床。一张桌子。\n\n“是你的了。没什么东西，但总比没有好。”\n\n{继续|intro10}`
    }

    static intro10() {
        return `“你想的话可以在镇上四处走走，只是别越过外墙。外面不安全。”\n\n他没等你回答就走了。\n\n{继续|home}`
    }

    static home() {
        return `你在自己的家里，可以在这里休息。\n\n{![bed.png]睡觉|sleep}\n{![storage.png]储物箱|storage}\n{![table.png]制作台|table}\n\n{![leave.png]离开|housingArea}`
    }

    static sleep() {
        stats['timeAwake'] = 0
        return `你正在睡觉，时间流逝得更快${processingGen()}\n\n{![leave.png]起床|home}`
    }

    static storage() {
        return `你可以把物品存在这里，以后再取。\n\n{![leave.png]离开|home|0|leaveStorage}`
    }

    static table() {
        return `你可以在这里制作物品。\n\n{![leave.png]离开|home}`
    }

    static housingArea() {
        return `你在城镇的住宅区，可以从这里回家或去其他地方。\n\n{![enter.png]家|home}\n\n{![town_center.png]城镇中心|townCenter|250}`
    }

    static townCenter() {
        return `你在城镇中心，许多人匆匆走过。\n\n{![poster.png]公告板|noticeBoard}\n{![dumbbells.png]训练场|trainingGrounds}\n{![training_dummy.png]道场|dojo}\n\n{![hospital.png]医院|hospital}\n{![dollar.png]商人|merchant}\n\n{![alley.png]巷子|alley}\n\n{![arrow_up.png]城北|townNorth|250}\n{![wood_door.png]住宅区|housingArea|250}`
    }

    static noticeBoard() {
        return `这里没什么你感兴趣的东西。\n\n{![leave.png]返回|townCenter}`
    }

    static trainingGrounds() {
        if (!checks['trainingGroundsTeamIntro'] && getTotalBattlestats() >= 10) {
            checks['trainingGroundsTeamIntro'] = true
            return `“嗨！我们是支新起的战斗队伍，参加竞技场的比赛。如果你愿意代表我们出战，我们会给你各种补给和装备，帮你快速提升属性。听着不错吧？”\n\n{![tick.png]好|trainingGroundsTeamIntro1}\n\n{![cross.png]以后再说|trainingGrounds}`
        }

        let r = `你在训练场，可以在这里锻炼力量、防御、速度或敏捷。\n\n{![chat.png]训练教官|trainingGroundsInstructor}`
        if (checks['trainingGroundsTeamIntro'] && team !== "nextLevel") {
            r += `\n\n{![tick.png]加入队伍|trainingGroundsTeamIntro1}`
        }
        
        if (team === "nextLevel") {
            r += `\n\n{队伍帐篷|trainingGrounds_nextLevel}`
        } else {
            r += `\n\n${genTrainingAreaText("trainingGrounds")}`
        }
        r += `\n\n{![leave.png]离开|townCenter}`
        return r
    }

    static trainingGroundsInstructor() {
        return `{![chat.png]询问属性|trainingGroundsInstructor_askStats}\n\n{![leave.png]返回|trainingGrounds}`
    }

    static trainingGroundsInstructor_askStats() {
        return `“每个人都有四项主要属性。力量提升你造成的伤害，防御减少你受到的伤害，速度提升你的命中率，敏捷提升你闪避攻击的几率。”\n\n{![leave.png]返回|trainingGroundsInstructor}`
    }

    static trainingGrounds_str() {
        return `你正在训练场做俯卧撑${processingGen()}\n\n{![stop.png]停止|trainingGrounds}`
    }

    static trainingGrounds_def() {
        return `你正在训练场练习站桩防御${processingGen()}\n\n{![stop.png]停止|trainingGrounds}`
    }

    static trainingGrounds_spd() {
        return `你正在训练场练习快速出拳${processingGen()}\n\n{![stop.png]停止|trainingGrounds}`
    }

    static trainingGrounds_dex() {
        return `你正在训练场的横木上练习平衡${processingGen()}\n\n{![stop.png]停止|trainingGrounds}`
    }

    static trainingGroundsTeamIntro1() {
        return `“太棒了！我把要知道的都告诉你，跟我来。”\n\n{继续|trainingGroundsTeamIntro2}`
    }

    static trainingGroundsTeamIntro2() {
        return `你跟着那个年轻人走进场地上的一个大帐篷。\n\n“这个帐篷里有我们全部的特殊训练器材和人员，在这里训练的效果是公共器材的两倍。”\n\n{继续|trainingGroundsTeamIntro3}`
    }

    static trainingGroundsTeamIntro3() {
        return `“我们会根据你在每周竞技场比赛中的名次发放锻炼药丸之类的奖励。除此之外，你还能从比赛主办方那里拿到钱。”\n\n{继续|trainingGroundsTeamIntro4}`
    }

    static trainingGroundsTeamIntro4() {
        changeInventory("exercisePill", 4, null, null, {"ignoreWeightLimit": true})
        team = "nextLevel"
        return `“竞技场比赛总是在星期日举行，我建议你现在就开始训练。这是 4 颗锻炼药丸，谢谢你加入我们。”\n\n{继续|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel() {
        let r = `你在队伍帐篷里。`
        if (checks['nextLevelExercisePills']) {r += `\n\n{领取锻炼药丸|trainingGrounds_nextLevel|0|nextLevelClaimExercisePill}`}
        r += `\n\n${genTrainingAreaText("trainingGrounds_nextLevel")}\n\n{![leave.png]离开|trainingGrounds}`
        return r
    }

    static trainingGrounds_nextLevel_str() {
        return `你正在队伍帐篷里举重${processingGen()}\n\n{![stop.png]停止|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_def() {
        return `你正在和队员对练${processingGen()}\n\n{![stop.png]停止|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_spd() {
        return `你正在队伍帐篷里原地慢跑${processingGen()}\n\n{![stop.png]停止|trainingGrounds_nextLevel}`
    }

    static trainingGrounds_nextLevel_dex() {
        return `你正在练习闪避队员的拳头${processingGen()}\n\n{![stop.png]停止|trainingGrounds_nextLevel}`
    }

    static dojo() {
        if (checks['dojo'] === undefined) {
            checks['dojo'] = true
            return `你走进道场时，一位老人迎了上来。\n\n“欢迎来到道场。这里是镇上各派系的格斗者磨炼战技的主要场所。”\n\n{继续|dojo}`
        } else {
            let r = `你在道场里。\n\n{![chat.png]道场教官|dojoInstructor}\n{![sword.png]对着训练人偶练习战斗|dojo_trainingDummy}\n\n` 
            if (quests['dojoIntro4'] || completedQuests.includes("dojoIntro4")) {r += `{![park.png]院子|dojoYard}`}
            r += `\n{![leave.png]离开|townCenter}`
            return r
        }
    }

    static dojo_trainingDummy() {
        generateEnemy("strawDummy")
        if (checks['firstDummy'] !== true) {combatStatus['onDeath'] = "firstTrainingDummy"}
        return `你正在对着训练人偶练习战斗${processingGen()}\n\n{![stop.png]停止|dojo|0|endFight}`
    }

    static dojoQuestIntro() {
        checks['firstDummy'] = true
        return `当你击败第一个训练人偶时，教官朝你走来。\n\n“你不是本地人吧？你看上去像是从另一个世界来的，不过我能看出你有潜力。”\n\n{继续|dojoQuestIntro2}`
    }

    static dojoQuestIntro2() {
        giveQuest("dojoIntro1")
        if (battleStats['str'] < 1.5) {
            return `“我愿意指导你，让你变强。但首先，你需要把力量练到 1.5 并摧毁 5 个稻草人偶。完成后回来找我。”\n\n{![leave.png]返回|dojo}`
        } else {
            return `“我愿意指导你，让你变强。但首先，你需要摧毁 5 个稻草人偶。完成后回来找我。”\n\n{![leave.png]返回|dojo}`
        }
    }

    static dojoInstructor() {
        return `“有事吗？”\n\n{![poster.png]任务完成|dojoInstructorQuest}\n\n{![leave.png]返回|dojo}`
    }

    static dojoInstructorQuest() {
        return genQuestGiver("dojo", {"none": `“看起来你还没有完成任何新任务。”\n\n{![leave.png]返回|dojoInstructor}`}, [
            {
                "quest": "dojoIntro1",
                "rewards": {
                    "exercisePill": 1
                },
                "message": `“干得不错，你已经证明自己能做些基础的战斗了。和真正的敌人不同，这些人偶不会还手，也不会移动。你的下一个任务：把所有战斗属性都练到 1.5，之后我会给你一些真正的敌人。”\n\n{![leave.png]返回|dojo}`
            },
            {
                "quest": "dojoIntro2",
                "rewards": {
                    "exercisePill": 1
                },
                "message": `“你现在有些像样的属性了，虽然还低于这个世界的普通人水平，但接下来我的任务你应该能顺利完成。你的目标是击败巷子里的 10 只老鼠。生命掉得太低就去医院。如果打老鼠很吃力，我建议再多练练。”\n\n{![leave.png]返回|dojo}`
            },
            {
                "quest": "dojoIntro3",
                "rewards": {
                    "exercisePill": 2
                },
                "message": `“干得不错，你已经证明自己能对付真正的敌人了。虽然只是些小家伙，但也是进步。你下一个任务是击败道场院子里的木魔像。这比老鼠难得多，不过你只需要击败一只。”\n\n{![leave.png]返回|dojo}`
            },
            {
                "quest": "dojoIntro4",
                "rewards": {
                    "exercisePill": 5
                },
                "message": `“恭喜你击败魔像，如果你愿意，院子里还有更多可以挑战。我的最后一个任务：把每项属性都练到 10。完成后你就能获得离开城镇探索的许可。这可能会花你不少时间，我不指望你很快完成。你可以一边在城里其他区域探索，一边朝目标努力。”\n\n{![leave.png]返回|dojo}`
            },
            {
                "quest": "dojoIntro5",
                "rewards": {
                    "exercisePill": 7
                },
                "message": `“我的任务线目前就到这里，你可以自由地去镇外探索，但要小心，外面有更强的敌人。”\n\n{![leave.png]返回|dojo}`
            }
        ])
    }

    static dojoYard() {
        return `你在道场的院子里。\n\n{![training_dummy.png]魔像|dojoGolems}\n\n{![leave.png]返回|dojo}`
    }

    static dojoGolems() {
        const golemText = [
            `{木魔像|dojo_golemFight|0|generateEnemy(woodGolem,woodGolem)}\n`,
            `{石魔像|dojo_golemFight|0|generateEnemy(stoneGolem,stoneGolem)}\n`,
            `{煤炭魔像|dojo_golemFight|0|generateEnemy(coalGolem,coalGolem)}\n`
        ]
        let r = `{稻草魔像|dojo_golemFight|0|generateEnemy(strawGolem,strawGolem)}\n`
        for (let i = 0; i < checks['golemMax'] || 0; i++) {
            r += golemText[i]
        }
        r += `\n{![leave.png]返回|dojoYard}`
        return r
    }

    static dojo_golemFight() {
        return `你正在与魔像战斗${processingGen()}\n\n{![leave.png]返回|dojoYard|0|endFight}`
    }

    static hospital() {
        if (health < calcMaxHp()) {
            return `医生正在为你治疗${processingGen()}\n\n{![leave.png]离开|townCenter}`
        } else {
            return `你的生命已经满了。\n\n{![leave.png]离开|townCenter}`
        }
    }

    static alley() {
        if (!quests['dojoIntro3'] && !completedQuests.includes("dojoIntro3")) {
            return `“抱歉，平民不准进入。我们这里有虫害问题。”\n\n{![leave.png]离开|townCenter}`
        } else {
            generateEnemy("mouse")
            return `你在巷子里。到处都是老鼠。\n\n{![leave.png]离开|townCenter|0|endFight}`
        }
    }

    static merchant() {
        let r = `“欢迎！我是镇上各类货物的主要供应商。你有草篮的话我也可以收。随便看看。”`
        if (quests['els3'] && !metQuests['els3']) {r += `\n\n{![chat.png]索要补给|merchantGuildQuestSupplies}`}
        r +=  `\n\n{![dollar.png]出售|merchantSell}\n\n{![leave.png]离开|townCenter}`
        return r
    }

    static merchantSell() {
        if (inventory['strawBasket'] === undefined) {
            return `“看来你没有草篮可以卖。等你有了再来，我每个出 $5。”\n\n{![leave.png]返回|merchant}`
        } else {
            return `“要把你所有的草篮一次卖掉，一共 ${colorGen("#cccc55", `$${inventory['strawBasket'] * 5}`)}？”\n\n{![tick.png]是|merchant|0|merchantSell}\n\n{![leave.png]返回|merchant}`
        }
    }

    static merchantGuildQuestSupplies() {
        changeInventory("huntersGuildSupplies", 1, null, null, {"ignoreWeightLimit": true})
        return `“啊，是埃尔斯叫你来的吧？来，拿着这个。”\n\n你接过商人递来的沉甸甸的箱子。\n\n{继续|merchant}`
    }

    static townNorth() {
        return `你在城镇北边，这片区域常用来娱乐消遣。\n\n{![park.png]公园|park}\n{![sword.png]武器店|weaponShop}\n{![sword.png]竞技场|theArenaEntrance}\n\n{![leave.png]城门|townGatesNorth|250}\n{![town_center.png]城镇中心|townCenter|250}`
    }

    static park() {
        return `你在公园里，四周散布着各种树木和植物。\n\n{![search.png]探索|parkExplore}\n\n{![leave.png]离开|townNorth}`
    }

    static parkExplore() {
        return `你正在公园里寻找有价值的东西${processingGen()}\n\n{![stop.png]停止|park}`
    }

    static weaponShop() {
        return `“欢迎光临我的武器店，我打造武器，也从各地进货。别打偷东西的主意，这里可是武器店。”\n\n{![leave.png]离开|townNorth}`
    }

    static theArenaEntrance() {
        arenaData = {}
        let r = `你在竞技场入口。`
        r += getDayName() === "星期日" ? ` 这里很拥挤，许多人正赶着排队买票。${checks['arenaParticipated'] === undefined ? "\n\n{![sword.png]参赛|theArenaSignup}" : ""}` : " 这里很空，星期日会有更多人来。"
        r += `\n\n{![leave.png]离开|townNorth}`
        return r
    }

    static theArenaSignup() {
        let r = `你加入报名的队伍，耐心等待轮到你。\n\n`
        r += getTotalBattlestats() >= 20 ? `“你好，你想参加比赛吗？”\n\n{![tick.png]是|theArenaSignupIntro1}\n{![cross.png]不|theArenaEntrance}` : `“很遗憾，你没有达到最低要求。等你的评级达到 ${colorGen("#88bb00", "G+")} 或更高再来吧。”\n\n{![leave.png]离开|theArenaEntrance}`
        return r
    }

    static theArenaSignupIntro1() {
        return `“很好，请往那边的门走。”\n\n{![enter.png]进入|theArenaSignupIntro2}`
    }

    static theArenaSignupIntro2() {
        arenaData['round'] = 1
        checks['arenaParticipated'] = true
        return `“欢迎来到竞技场，格斗者。你将参加一连串比赛，对手会越来越强，输一场就会被淘汰。这是本镇最大的盛事，有数百名参赛者和数千名观众。每场比赛结束后你最多有 60 分钟休息时间。祝你好运，准备好了就开始。”\n\n{![enter.png]开始|theArenaWalkIn}`
    }

    static theArenaWalkIn() {
        delete arenaData['endTime']
        if (arenaData['round'] > arenaStatData.length) {
            return `你正走进竞技场时，主办人伸手拦住你。“目前就到这里了，继续往前可不是好主意。建造这里的人说过，暂时没有更多可以挑战的东西了。”\n\n{![leave.png]退赛|theArenaEntrance|0|theArenaResign}`
        } else {
            return `你走进竞技场，准备迎战对手。\n\n主办人喊道：“这是第 ${arenaData['round']} 轮，准备！”\n\n{![sword.png]战斗|theArenaFight}`
        }
    }

    static theArenaFight() {
        const newStats = arenaStatData[arenaData['round'] - 1]
        if (newStats['enemyType'] === undefined) {
            generateEnemy("human", {
                "health": newStats['health'],
                "str": newStats['stats'],
                "def": newStats['stats'],
                "spd": newStats['stats'],
                "dex": newStats['stats']
            })
        } else {
            generateEnemy(newStats['enemyType'])
        }
        combatStatus['onDeath'] = "arenaWinMatch"
        return `你正在竞技场里与对手交战${processingGen()}\n\n{![shield.png]认输|theArenaEntrance|0|theArenaResign}`
    }

    static theArenaWinMatch() {
        let r = ""
        if (team === "nextLevel" && checks['nextLevelCongrats'] === false) {
            r += `一名队员朝你跑来\n\n“恭喜赢下第一场比赛，你打得真棒”\n\n`
            checks['nextLevelCongrats'] = true
        } else {
            r += `“干得不错，参赛者，你赢下了第 ${englishifyNumber(arenaData['round'])} 轮，下一轮马上开始。”`
        }
        r += `\n\n{![enter.png]立即开始|theArenaWalkIn}\n\n{![hospital.png]医疗室|theArenaMedbay}\n\n{![leave.png]退赛|theArenaEntrance|0|theArenaResign}`
        return r
    }

    static theArenaMedbay() {
        let r = ""
        if (health < calcMaxHp()) {
            r += `医生正在为你治疗${processingGen()}`
        } else {
            r += `你的生命已经满了。`
        }
        r += `\n\n{![leave.png]离开|theArenaWinMatch}`
        return r
    }

    static townGatesNorth() {
        let r = `你站在城门前。\n\n`
        r += completedQuests.includes("dojoIntro5") ? `“如果你愿意，你可以获准离开城镇，随时都能回来。”\n\n{![leave.png]离开城镇|townGatesNorthExterior}` : `“你太弱了，独自出城太冒险，我们不能放你过去。”`
        r += `\n\n{![arrow_up.png]城北|townNorth|250}`
        return r
    }

    static townGatesNorthExterior() {
        return `你站在城门外侧。\n\n{![park.png]草原|grassPlains|500}\n{![enter.png]进入城镇|townGatesNorth}`
    }

    static grassPlains() {
        return `你站在草原上，注意到几只史莱姆在跳来跳去。\n\n{![leave.png]逃走|grassPlains|0|grassPlainsEscape}\n\n{![forest.png]森林|forestLayer1|1000|endFight}\n{![enter.png]城门|townGatesNorthExterior|500|endFight}`
    }

    static forestLayer1() {
        discoverRecipe("woodenAxe")
        let r =  `你站在森林入口附近，旁边的树木遮出一些阴凉。`
        if (checks['forestLayer1EnemiesRemaining'] !== 0) {r += ` 有些怪物堵住了通往深处的路。`}
        r += `\n\n{![search.png]探索|forestLayer1Explore}`
        if (checks['forestLayer1EnemiesRemaining'] !== 0) {r += `\n{![sword.png]清路|forestLayer1Clear}`}
        if (checks['huntersGuildMission'] && !checks['huntersGuildMission']['complete']) {r += `\n{![sword.png]狩猎|forestHunt}`}
        r += `\n\n{![sword_shield.png]猎人公会|huntersGuild}\n\n`
        if (checks['forestLayer1EnemiesRemaining'] === 0) {r += `{![arrow_right.png]朝中心走去|forestLayer2|300(森林中心)}\n`}
        r += `{![park.png]草原|grassPlains|1000}`
        return r
    }

    static forestLayer1Explore() {
        return `你正在森林里搜寻物品${processingGen()}\n\n{![stop.png]停止|forestLayer1}`
    }

    static forestLayer1Clear() {
        return `你正在清理堵住森林小路的敌人。\n${checks['forestLayer1EnemiesRemaining'] || 100} 个敌人残存${processingGen()}\n\n{![stop.png]停止|forestLayer1|0|endFight}`
    }

    static huntersGuild() {
        if (!checks['huntersGuildIntro']) {
            return `你慢慢走进猎人公会，里面的人似乎正在讨论森林里的敌人。你在旁边站了一分钟，直到有人请你去听。\n\n你完全听不懂。\n\n{继续|huntersGuildIntro}`
        } else {
            let r = `你在猎人公会里，一群猎人聚在壁炉旁。\n\n{![fire.png]壁炉|huntersGuildFireplace}`
            if (completedQuests.includes("els5")) {r += `\n{![poster.png]狩猎任务|huntersGuildMissions}`} 
            r += `\n\n{![leave.png]离开|forestLayer1}`
            return r
        }
    }

    static huntersGuildIntro() {
        checks['huntersGuildIntro'] = true
        return `“抱歉，刚才说得有点急，可能不太好懂。森林里出现了迫近的威胁，我们得先准备应急方案。”\n\n他伸出手，有力地和你握了握。\n\n“我叫埃尔斯，是这个公会的会长。我们的工作是发现、研究并猎杀这片森林里的各种生物。”\n\n“想了解更多的话，来壁炉边找我聊。”\n\n{继续|huntersGuild}`
    }

    static huntersGuildFireplace() {
        return `你坐在猎人公会壁炉旁的椅子上。\n\n{![chat.png]和埃尔斯说话|huntersGuildEls}\n\n{![leave.png]离开|huntersGuild}`
    }

    static huntersGuildEls() {
        let r = `“你好，今天需要什么？”`
        if (checks['huntersGuildAskQuest']) {
            if (!["els1", "els2", "els3", "els4", "els5"].some(key => quests[key])) {
                r += `\n\n{![poster.png]接受任务|huntersGuildElsQuest}`
            } else {
                r += `\n\n{![poster.png]任务完成|huntersGuildElsQuest}`
            }
        }
        r += `\n\n{![chat.png]打听公会|huntersGuildEls_askGuild}\n{![chat.png]打听生物|huntersGuildEls_askForest}`
        if (!checks['huntersGuildAskQuest']) {r += `\n{![chat.png]打听任务|huntersGuildEls_askQuests}`}
        r += `\n\n{![leave.png]离开|huntersGuildFireplace}`
        return r
    }

    static huntersGuildElsQuest() {
        return genQuestGiver("els", {"none": `“你还没完成我的任务。”\n\n{![leave.png]返回|huntersGuildEls}`, "allComplete": `“我的任务你目前都做完了。”\n\n{![leave.png]返回|huntersGuildEls}`}, [
            {
                "quest": "els1",
                "money": 10,
                "consumed": {
                    "wood": 3
                },
                "introMessage": `“我们最近正缺柴火，得让壁炉一直烧着。去森林里搜集，弄到 3 份木材。弄好了回来。”\n\n{![leave.png]返回|huntersGuildEls}`,
                "message": `“谢谢你的柴火，这些应该能让火再多烧几个小时。”\n\n{![leave.png]返回|huntersGuildEls}`
            },
            {
                "quest": "els2",
                "money": 20,
                "introMessage": `“我们打算把搜索范围扩展到森林的一片新区域。去森林小路那边，把路上的敌人清理掉。”\n\n{![leave.png]返回|huntersGuildEls}`,
                "message": `“谢谢你的帮助，我会派几个人去森林深处探索。要是有什么发现，我会告诉你。”\n\n{![leave.png]返回|huntersGuildEls}`
            },
            {
                "quest": "els3",
                "money": 10,
                "consumed": {
                    "huntersGuildSupplies": 1
                },
                "completeExecute": function() {
                    checks['elsQuestlineCooldown'] = time + 1440 * 2
                },
                "introMessage": `“我们最近补给有点吃紧，还想在这栋楼里再开一片区域。你能去城里的商人那儿取些补给回来吗？就跟商人说是我派你去的。包裹可能会有点沉。”\n\n{![leave.png]返回|huntersGuildEls}`,
                "message": `“再次感谢，这些够用一阵了。大概 2 天后我可以再给你一个任务”\n\n{![leave.png]返回|huntersGuildEls}`,
            },
            {
                "quest": "els4",
                "money": 30,
                "consumed": {
                    "stone": 10
                },
                "requirements": [
                    {"check": function() {return time >= checks['elsQuestlineCooldown']}, "message": `“我们还没准备好，等 ${formatTime(checks['elsQuestlineCooldown'] ?? 0, false, "${dayName} ${hours}:${minutes}")} 再来吧。”\n\n{![leave.png]返回|huntersGuildEls}`}
                ],
                "introMessage": `“我们的工程需要一些石头。去森林深处的矿坑收集 10 块石头。弄好了回来。”\n\n{![leave.png]返回|huntersGuildEls}`,
                "message": `“谢谢你的石头，我们的工程又近了一步。”\n\n{![leave.png]返回|huntersGuildEls}`
            },
            {
                "quest": "els5",
                "money": 20,
                "consumed": {
                    "wood": 20
                },
                "introMessage": `“这应该是我们工程的最后一项需求了。我们需要不少木材，具体说是 20 份。建议用斧头去砍几棵树。”\n\n{![leave.png]返回|huntersGuildEls}`,
                "message": `“就这些了，给我一点时间。”\n\n你耐心等着，他把刚送来的木材交给几位公会成员。\n\n他小跑回来。\n\n“对，就差这些了。我很高兴地宣布，我们现在有了专门的狩猎任务区域。所有公会成员都能接下小型的猎杀委托来赚取报酬。头几个任务应该很快就能挂出来。”\n\n{![leave.png]返回|huntersGuildEls}`
            }
        ])
    }

    static huntersGuildEls_askGuild() {
        return `“猎人公会是多年前由一小群想研究这片森林的人创立的。公会成立不久后，我被任命为会长。”\n\n“森林非常辽阔，探索起来很困难。我们还没有摸清森林里的所有生物。”\n\n{![leave.png]返回|huntersGuildEls}`
    }

    static huntersGuildEls_askForest() {
        return `“森林里住着许多生物，有些无害，有些极度危险。一般来说森林外围还算安全，所以除非你足够强，我建议别走得太深。”\n\n{![leave.png]返回|huntersGuildEls}`
    }

    static huntersGuildEls_askQuests() {
        checks['huntersGuildAskQuest'] = true
        return `“任务？”\n\n“我大概能给你一些收集资源的任务，当然有报酬。感兴趣的话再来找我。”\n\n{![leave.png]返回|huntersGuildEls}`
    }

    static huntersGuildHeal() {
        let r = `你在猎人公会的一间屋子里。\n\n“我们这里的资源有限，没办法把你完全治好。准备好了就回城里的医院吧。”\n\n`
        if (getTimeName() === "night") {r += `埃尔斯走出房间前说：“提醒你一句，森林在夜里更危险”\n\n`}
        r += `{![leave.png]返回|huntersGuild}`
        return r
    }

    static huntersGuildMissions() {
        let r = `你看了看猎人公会的任务板。`
        
        let missions = dailyChecks['huntersGuildMissions'] ?? []
        if (!dailyChecks['huntersGuildMissions']) {
            for (let i = 0; i < randomRange(1, 2, 0); i++) {
                let minStats = randomRange(30, 100, 0)
                let maxStats = minStats + randomRange(25, 50, 0)
                missions.push({
                    "enemy": "wildAnimal",
                    "stats": [minStats, maxStats],
                    "reward": randomRange(10, 15, 0),
                    "health": randomRange(300, 600, 0)
                })
            }
            dailyChecks['huntersGuildMissions'] = missions
        }

        let missionTexts = []
        for (let i = 0; i < missions.length; i++) {
            let mission = missions[i]
            let rankText = colorGen("#88bb00", getRank(mission['stats'][0] * 4))
            if (getRank(mission['stats'][0] * 4) !== getRank(mission['stats'][1] * 4)) {
                rankText = `${colorGen("#88bb00", getRank(mission['stats'][0] * 4))} 至 ${colorGen("#88bb00", getRank(mission['stats'][1] * 4))}`
            }
            missionTexts.push(`{领取|huntersGuild|0|huntersGuildClaimMission(${i})} - ${enemyData[mission['enemy']]['name']} ${colorGen("#cccc55", `$${mission['reward']}`)} ${rankText}`)
        }
        r += missionTexts.length > 0 ? "\n\n" : "\n\n今天没有可接的任务。"
        r += missionTexts.join("\n")
        
        if (checks['huntersGuildMission']) {
            if (checks['huntersGuildMission']['complete']) {
                r += "\n\n{![dollar.png]领取奖励|huntersGuild|0|huntersGuildClaimMission(-1)}"
            } else {
                r += "\n\n{![cross.png]放弃任务|huntersGuild|0|huntersGuildClaimMission(-1)}"
            }
        }

        r += "\n\n{![leave.png]离开|huntersGuild}"
        return r
    }

    static forestHunt() {
        return `你正在追踪猎物${processingGen()}\n\n{![stop.png]停止|forestLayer1|0|endHunt}`
    }

    static forestLayer2() {
        return `你能看见远处的森林入口。\n\n{![alley.png]矿坑|forestMineEntrance}\n{![dumbbells.png]森林健身房|forestGym}\n\n{![arrow_left.png]朝出口走去|forestLayer1|300(森林入口)}`
    }

    static forestMineEntrance() {
        return `你在矿坑入口。这里似乎已经废弃了。\n\n{![enter.png]进入|forestMine}\n\n{![forest.png]森林|forestLayer2}`
    }

    static forestMine() {
        discoverRecipe("woodenPickaxe")
        let r = `你在矿坑里。\n`
        r += equipment['tool'] !== null && itemData[equipment['tool'][0]]['subclass'] === "pickaxe" ? `<span id=action-text>你正用镐子开采石头和其他材料${processingGen()}</span>` : `<span id=action-text>采矿需要先装备一把镐子。</span>`
        r += `\n\n{![leave.png]离开|forestMineEntrance}`
        return r
    }

    static forestGym() {
        return `你在森林健身房。这里似乎只对会员开放。${checks['forestGymMembership2'] ? `\n\n你已是高级会员。\n\n${genTrainingAreaText("forestGymAdvanced")}` : checks['forestGymMembership1'] ? `\n\n你已是基础会员。\n\n${genTrainingAreaText("forestGymBasic")}` : ""}\n\n{![chat.png]教练|forestGymTrainer}\n\n{![leave.png]离开|forestLayer2}`
    }

    static forestGymTrainer() {
        let r = `“欢迎来到森林健身房，这地方是我亲手建的，为了把训练效率做到最好。本来只给我自己用，后来我决定开始卖会员。”`
        if (!checks['forestGymMembership1'] || !checks['forestGymMembership2']) {r += `\n\n{![chat.png]询问会员|forestGymTrainerMembershipAsk}`}
        if (checks['forestGymMembership2'] && !checks['forestGymCharmPurchase']) {r += `\n\n{![chat.png]问他戴的护符|forestGymTrainerCharmAsk}`}
        r += `\n\n{![leave.png]离开|forestGym}`
        return r
    }

    static forestGymTrainerMembershipAsk() {
        let r = `“我提供两种会员。基础会员 $100，可以使用基础器材。高级会员 $400，包含基础会员的所有权益，还能使用我自己在用的实验性器材。价格有点高，但确实物有所值。”`
        if (!checks['forestGymMembership1'] && !checks['forestGymMembership2']) {r += `\n\n{基础会员（$100）|forestGym|0|forestGymMembershipPurchase(basic)}`}
        if (!checks['forestGymMembership2']) {r += `${checks['forestGymMembership1'] ? "\n\n" : "\n"}{高级会员（$400）|forestGym|0|forestGymMembershipPurchase(advanced)}`}
        r += `\n\n{![leave.png]离开|forestGym}`
        return r
    }

    static forestGymTrainerCharmAsk() {
        return `“我训练时偶尔会戴这个护符。不过不能常用，用起来身体会疼。但它确实能让我的训练稍微有效一些。想要的话我可以 $200 卖给你。”\n\n{购买护符（$200）|forestGym|0|forestGymCharmPurchase}\n\n{![leave.png]离开|forestGym}`
    }

    static forestGymBasic_str() {
        return `你正在森林健身房里举重${processingGen()}\n\n{![stop.png]停止|forestGym}`
    }

    static forestGymBasic_def() {
        return `你正在森林健身房里练习格挡${processingGen()}\n\n{![stop.png]停止|forestGym}`
    }

    static forestGymBasic_spd() {
        return `你正在森林健身房的跑道上跑步${processingGen()}\n\n{![stop.png]停止|forestGym}`
    }

    static forestGymBasic_dex() {
        return `你正在森林健身房里练习步法${processingGen()}\n\n{![stop.png]停止|forestGym}`
    }

    static forestGymAdvanced_str() {
        return `你正在森林健身房里搬石头${processingGen()}\n\n{![stop.png]停止|forestGym}`
    }

    static forestGymAdvanced_def() {
        let r = ""
        if (!checks['forestGymAdvancedDefFirst']) {
            r += `你向教练请教这种训练方法。\n\n“对我有用，对别人也一定有用。”\n\n`
            checks['forestGymAdvancedDefFirst'] = true
        }
        r += `你正在森林健身房里练习撞墙${processingGen()}\n\n{![stop.png]停止|forestGym}`
        return r
    }

    static forestGymAdvanced_spd() {
        return `你正在森林健身房里跑坡${processingGen()}\n\n{![stop.png]停止|forestGym}`
    }

    static forestGymAdvanced_dex() {
        return `你正在森林健身房里练习跨栏${processingGen()}\n\n{![stop.png]停止|forestGym}`
    }
}

class sceneFunctions {
    static endFight() {
        endFight()
    }

    static leaveStorage() {
        toggleStorageAccess(false)
    }

    static merchantSell() {
        changeMoney(inventory['strawBasket'] * 5)
        changeInventory("strawBasket", -inventory['strawBasket'])
    }

    static cancelCrafting() {
        craftingSelection = false
        if (craftStatus['recipe']) {
            let craftingType = itemData[craftStatus['recipe']]['crafting']['type']
            if (craftingType === undefined) {
                changeSkill("crafting", -craftStatus['skillXp'])
                changeTitleXp("crafter", -craftStatus['skillXp'] * 2)
            } else if (craftingType === "alchemy") {
                changeSkill("alchemy", -craftStatus['skillXp'])
                changeTitleXp("alchemist", -craftStatus['skillXp'] * 2)
            }
        }
        craftStatus['recipe'] = null
        craftStatus['completed'] = 0
        craftStatus['goal'] = 0
        craftStatus['using'] = []
        craftStatus['skillXp'] = 0

        for (const elem of document.querySelectorAll(".item-selected")) {
            elem.remove()
        }
    }

    static generateEnemy(args) {
        let enemy, onDeath
        if (typeof args === "string") {
            enemy = args
        } else {
            [enemy, onDeath] = args
        }
        generateEnemy(enemy)
        if (onDeath) {
            combatStatus['onDeath'] = onDeath
        }
    }

    static theArenaResign() {
        endFight()
        if (arenaStatData[arenaData['round'] - 2]) {
            prependText = `你退出了竞技场。\n\n${colorGen("#ffee00", `你获得了 $${arenaStatData[arenaData['round'] - 2]['reward']} 的参赛报酬`)}\n\n`
            changeMoney(arenaStatData[arenaData['round'] - 2]['reward'])
            if (team === "nextLevel") {
                checks['nextLevelExercisePills'] = Math.round(arenaStatData[arenaData['round'] - 2]['reward'] / 10)
            }
        } else {
            prependText = `你退出了竞技场。\n\n`
        }
        arenaData = {}
    }

    static nextLevelClaimExercisePill() {
        changeInventory("exercisePill", checks['nextLevelExercisePills'], null, null, {"ignoreWeightLimit": true})
        delete checks['nextLevelExercisePills']
    }

    static grassPlainsEscape() {
        endFight()
        checks['spawnDelay'] = time + 5
    }

    static forestGymMembershipPurchase(tier) {
        if (tier === "basic") {
            if (money >= 100) {
                changeMoney(-100)
                checks['forestGymMembership1'] = true
                prependText = `你购买了基础会员，花费 ${colorGen("#cccc55", "$100")}。\n\n`
            } else {
                prependText = "你的钱不够买这个。\n\n"
            }
        } else if (tier === "advanced") {
            if (money >= 400) {
                changeMoney(-400)
                checks['forestGymMembership2'] = true
                prependText = `你购买了高级会员，花费 ${colorGen("#cccc55", "$400")}。\n\n`
            } else {
                prependText = "你的钱不够买这个。\n\n"
            }
        }
    }

    static forestGymCharmPurchase() {
        if (money >= 200) {
            if (changeInventory("strangeTrainingCharm", 1)) {
                changeMoney(-200)
                checks['forestGymCharmPurchase'] = true
                prependText = `你购买了训练护符，花费 ${colorGen("#cccc55", "$200")}。\n\n`
            }
        } else {
            prependText = "你的钱不够买这个。\n\n"
        }
    }

    static huntersGuildClaimMission(arg) {
        let i = Number(arg)
        if (i === -1) {
            if (checks['huntersGuildMission']['complete']) {
                prependText = `你获得了 ${colorGen("#cccc55", `$${checks['huntersGuildMission']['reward']}`)}，作为完成任务的报酬。\n\n`
                changeMoney(checks['huntersGuildMission']['reward'])
            } else {
                prependText = "你放弃了任务。\n\n"
            }
            delete checks['huntersGuildMission']
            return
        }

        if (!checks['huntersGuildMission']) {
            if (!dailyChecks['huntersGuildMissions']) {
                prependText = "这个任务已经过期了。\n\n"
                return
            }
            const mission = dailyChecks['huntersGuildMissions'][i]
            checks['huntersGuildMission'] = {
                "enemy": mission['enemy'],
                "stats": {
                    "maxHealth": mission['health'],
                    "health": mission['health'],
                    "str": randomRange(mission['stats'][0], mission['stats'][1], 0),
                    "def": randomRange(mission['stats'][0], mission['stats'][1], 0),
                    "spd": randomRange(mission['stats'][0], mission['stats'][1], 0),
                    "dex": randomRange(mission['stats'][0], mission['stats'][1], 0),
                },
                "reward": mission['reward']
            }
            delete dailyChecks['huntersGuildMissions'].splice(i, 1)
        } else {
            prependText = "你已经有一个进行中的任务了。\n\n"
        }
    }

    static endHunt() {
        checks['huntersGuildMission']['stats']['health'] = combatStatus['enemyHealth']
        endFight()
    }

    static walkBack() {
        travelStatus['backwards'] = true
        travelStatus['destination'] = currentScene
        let arrival = Math.ceil(time + Number(travelStatus['completed']) / getMovementSpeed())
        processText(`你正往回走，将在 ${colorGen("#ccccff", formatTime(arrival, true), "text-arrival")}${processingGen()}`)
    }
}

class sceneEndFunctions {
    static merchant() {
        generateShop("merchant")
    }

    static table() {
        generateCraftingMenu()
    }

    static weaponShop() {
        generateShop("weaponShop")
    }

    static storage() {
        generateStorageMenu()
        toggleStorageAccess(true)
    }
}

const mainElement = document.getElementById("main")

function processText(text) {
    sceneText = text
    while (mainElement.lastChild) {
        mainElement.removeChild(mainElement.lastChild)
    }
    const splitText = text.split(textSplitter)
    const splitLinks = [...text.matchAll(linkRegex)]
    
    splitText.forEach(function(item, num) {
        let div = document.createElement("div")
        div.className = "main-text"
        
        let parts = item.split(imageRegex)
        parts.forEach(function(part, index) {
            if (index % 2 === 0) {
                let span = document.createElement("span")
                span.innerHTML = part
                div.appendChild(span)
            } else {
                let img = document.createElement("img")
                img.src = "img/" + part
                img.style.display = "inline-block"
                img.style.width = "1.5em"
                img.style.height = "1.5em"
                img.style.marginRight = "6px"
                img.style.verticalAlign = "middle"
                div.appendChild(img)
            }
        })
        
        mainElement.appendChild(div)
        
        if (num < splitLinks.length) {
            let button = document.createElement("button")
            let labelParts = splitLinks[num][1].split(imageRegex)
            if (labelParts.length > 1) {
                labelParts.forEach(function(part, index) {
                    if (index % 2 === 0) {
                        if (part.length > 0) {
                            let span = document.createElement("span")
                            if (!settings['keyboardNavigation']) {
                                span.innerHTML = part
                            } else {
                                span.innerHTML = `(${num + 1}) ${part}`
                            }
                            button.appendChild(span)
                        }
                    } else {
                        if (settings['sceneImages'] !== false) {
                            let img = document.createElement("img")
                            img.src = "img/" + part
                            img.style.display = "inline-block"
                            img.style.width = "1.5em"
                            img.style.height = "1.5em"
                            img.style.marginRight = "6px"
                            img.style.verticalAlign = "middle"
                            button.appendChild(img)
                        }
                    }
                })
            } else {
                if (!settings['keyboardNavigation']) {
                    button.innerHTML = splitLinks[num][1]
                } else {
                    button.innerHTML = `(${num + 1}) ${splitLinks[num][1]}`
                }
            }
            
            button.className = "main-link"
            button.id = "button" + num
            button.addEventListener("click", function() {
                if (splitLinks[num][4] !== undefined) {
                    let params = splitLinks[num][5] ? (splitLinks[num][5].includes(",") ? splitLinks[num][5].split(",") : splitLinks[num][5]) : undefined
                    sceneFunctions[splitLinks[num][4]](params)
                }
                if (splitLinks[num][3] === undefined || Number(splitLinks[num][3]) === 0) {
                    sceneManager(splitLinks[num][2])
                } else {
                    const distance = Number(splitLinks[num][3].split("(")[0])
                    let walkTextOverride
                    if (splitLinks[num][3].includes("(")) {walkTextOverride = splitLinks[num][3].split("(")[1].slice(0, -1)}
                    let arrival = Math.ceil(time + Number(distance) / getMovementSpeed())
                    if (settings['skipTravel'] >= arrival - time) {
                        insertLog(`时间跳过 ${colorGen("#99bbee", arrival - time)} 分钟`)
                        changeSkill("walking", arrival - time)
                        stats['distanceTravelled'] = (stats['distanceTravelled'] ?? 0) + distance
                        changeTime(arrival - time)
                        sceneManager(splitLinks[num][2])
                    } else {
                        processText(`你正走向 ${colorGen("#99bbee", walkTextOverride || splitLinks[num][1].replace(imageRegex, ""))}，将在 ${colorGen("#ccccff", formatTime(arrival, true), "text-arrival")}${processingGen()}\n\n{![arrow_left.png]往回走|noChange|0|walkBack}`)
                        travelStatus['destination'] = splitLinks[num][2]
                        travelStatus['distance'] = Number(distance)
                    }
                }
                playTransition()
            })
            mainElement.appendChild(button)
        }
    })
}

function sceneManager(selected) {
    if (selected === "noChange") {return}

    const selectedScene = scenes[selected]()
    if (sceneRegions[selected]) {
        region = sceneRegions[selected]
    }

    for (const [action, value] of Object.entries(activeActions)) {
        delete activeActions[action]
        if (actionData[action]['disable']) {
            actionData[action]['disable']()
        }
    }

    processText((prependText || "") + selectedScene)
    prependText = ""
    currentPrependText = ""
    if (sceneEndFunctions[selected]) {sceneEndFunctions[selected]()}
    oldScene = currentScene
    currentScene = selected
    
    trainingSession = {
        "logId": null,
        "gain": 0,
        "stat": null
    }

    generateActions()
}

// Settings
let settingsMenuLoaded = false
let settings = loadFromLocal("arkivia-settings") || {}
const eventListenerStorage = {}
const settingsData = {
    "sceneTransitions": {
        "type": "toggle",
        "text": "场景切换",
        "default": true
    },
    "sceneImages": {
        "type": "toggle",
        "text": "场景图片",
        "default": true
    },
    "keyboardNavigation": {
        "type": "toggle",
        "text": "键盘导航",
        "default": false,
        "on": function() {
            if (!eventListenerStorage['keyboardNavigation']) {
                eventListenerStorage['keyboardNavigation'] = function(e) {
                    if (e.repeat || e.ctrlKey) {return}
                    if (!isNaN(parseInt(e.key))) {
                        const target = document.getElementById(`button${parseInt(e.key) - 1}`)
                        if (target) {
                            target.click()
                        }
                    }
                }

                document.addEventListener("keydown", eventListenerStorage['keyboardNavigation'])
            }
        },
        "off": function() {
            if (eventListenerStorage['keyboardNavigation']) {
                document.removeEventListener("keydown", eventListenerStorage['keyboardNavigation'])
                delete eventListenerStorage['keyboardNavigation']
            }
        }
    },
    "mobileLayout": {
        "type": "toggle",
        "text": "移动端布局",
        "default": false,
        "on": function() {
            mobileLayout()
            insertLog("向右滑动可打开背包和技能")
        },
        "off": function() {
            desktopLayout()
        }
    },
    "autoRepeatCrafting": {
        "type": "toggle",
        "text": "自动重复制作",
        "default": false
    },
    "skipTravel": {
        "type": "number",
        "text": "跳过的路程上限",
        "tooltip": "用时短于所填分钟数的赶路会被直接跳过。\n\n把它设得很高有点作弊的意味，不过没人拦着你。",
        "default": "0"
    },
    "dateFormat": {
        "type": "text",
        "text": "日期格式",
        "tooltip": "可自定义日期格式，占位符用 ${name} 表示。\n\n可用占位符：dayName、shortDayName、timeName、year、month、day、hours、minutes。\n\n例如：${hours}:${minutes} 会显示为 12:34",
        "default": "${dayName} ${timeName} ${year}-${month}-${day} ${hours}:${minutes}"
    },
    // Theme stuff
    "theme_background": {
        "type": "color",
        "text": "背景颜色",
        "default": "#222244",
        "execute": function(value) {
            document.documentElement.style.setProperty("--background", value)
        }
    },
    "theme_color": {
        "type": "color",
        "text": "文字颜色",
        "default": "#ffffff",
        "execute": function(value) {
            document.documentElement.style.setProperty("--color", value)
        }
    },
    "theme_foregroundBackground": {
        "type": "color",
        "text": "前景背景颜色",
        "default": "#333333",
        "execute": function(value) {
            document.documentElement.style.setProperty("--foreground-background", value)
        }
    },
    "theme_foregroundBackgroundDark": {
        "type": "color",
        "text": "前景深色背景颜色",
        "default": "#282828",
        "execute": function(value) {
            document.documentElement.style.setProperty("--foreground-background-dark", value)
        }
    },
    "theme_backgroundBackground": {
        "type": "color",
        "text": "背景的背景颜色",
        "default": "#222222",
        "execute": function(value) {
            document.documentElement.style.setProperty("--background-background", value)
        }
    },
    "theme_centerBackground": {
        "type": "color",
        "text": "中心背景颜色",
        "default": "#222222",
        "execute": function(value) {
            document.documentElement.style.setProperty("--center-background", value)
        }
    },
    "theme_centerTopBackground": {
        "type": "color",
        "text": "顶部栏背景颜色",
        "default": "#332233",
        "execute": function(value) {
            document.documentElement.style.setProperty("--center-top-background", value)
        }
    },
    "theme_centerTopColor": {
        "type": "color",
        "text": "顶部栏文字颜色",
        "default": "#ccccff",
        "execute": function(value) {
            document.documentElement.style.setProperty("--center-top-color", value)
        }
    },
    "theme_equipmentBackground": {
        "type": "color",
        "text": "装备背景颜色",
        "default": "#333344",
        "execute": function(value) {
            document.documentElement.style.setProperty("--equipment-background", value)
        }
    },
    "theme_equipmentBorder": {
        "type": "color",
        "text": "装备边框颜色",
        "default": "#444499",
        "execute": function(value) {
            document.documentElement.style.setProperty("--equipment-border", value)
        }
    },
    "theme_equipmentDurabilityBackground": {
        "type": "color",
        "text": "装备耐久背景颜色",
        "default": "#555577",
        "execute": function(value) {
            document.documentElement.style.setProperty("--equipment-durability-background", value)
        }
    },
    "theme_tooltipBackground": {
        "type": "color",
        "text": "提示框背景颜色",
        "default": "#111111",
        "execute": function(value) {
            document.documentElement.style.setProperty("--tooltip-background", value)
        }
    },
    "theme_tooltipColor": {
        "type": "color",
        "text": "提示框文字颜色",
        "default": "#ffffff",
        "execute": function(value) {
            document.documentElement.style.setProperty("--tooltip-color", value)
        }
    },
    "theme_menuButtonBackground": {
        "type": "color",
        "text": "菜单按钮背景颜色",
        "default": "#444444",
        "execute": function(value) {
            document.documentElement.style.setProperty("--menu-button-background", value)
        }
    },
    "theme_menuButtonBackgroundHover": {
        "type": "color",
        "text": "菜单按钮悬停颜色",
        "default": "#555555",
        "execute": function(value) {
            document.documentElement.style.setProperty("--menu-button-background-hover", value)
        }
    },
    "theme_bottombarBackground": {
        "type": "color",
        "text": "底部栏背景颜色",
        "default": "#999999",
        "execute": function(value) {
            document.documentElement.style.setProperty("--bottombar-background", value)
        }
    },
    "theme_skillbarFill": {
        "type": "color",
        "text": "技能栏背景颜色",
        "default": "#888844",
        "execute": function(value) {
            document.documentElement.style.setProperty("--skillbar-background", value)
        }
    },
    "theme_healthbarFill": {
        "type": "color",
        "text": "生命条背景颜色",
        "default": "#449944",
        "execute": function(value) {
            document.documentElement.style.setProperty("--healthbar-background", value)
        }
    },
    "theme_energybarFill": {
        "type": "color",
        "text": "体力条背景颜色",
        "default": "#bb4444",
        "execute": function(value) {
            document.documentElement.style.setProperty("--energy-bar-background", value)
        }
    },
    "theme_xpbarFill": {
        "type": "color",
        "text": "经验条背景颜色",
        "default": "#4444bb",
        "execute": function(value) {
            document.documentElement.style.setProperty("--xp-bar-background", value)
        }
    },
    "saveName": {
        "type": "text",
        "text": "存档文件名",
        "tooltip": "可自定义导出存档时使用的文件名。不要使用文件系统限制的字符，否则可能出问题，这类字符包括：< > : \" / \\ | ? * 。\n\n占位符用 ${name} 表示。\n\n可用占位符：realYear、realMonth、realDay、realHours、realMinutes、realSeconds、timestamp、day、version",
        "default": "Arkivia.sav"
    }
}
const settingsCategories = {
    "language": {
        "name": (window.ARK_LANG_NAME || "Language"),
        "execute": function(el) {
            if (window.ARK_LANG_UI) {window.ARK_LANG_UI(el)}
        }
    },
    "interface": {
        "name": "界面",
        "settings": [
            "sceneTransitions",
            "sceneImages",
            "",
            "dateFormat",
            "",
            "mobileLayout"
        ]
    },
    "accessibility": {
        "name": "无障碍",
        "settings": [
            "keyboardNavigation"
        ]
    },
    "gameplay": {
        "name": "玩法",
        "settings": [
            "autoRepeatCrafting"
        ]
    },
    "theme": {
        "name": "主题",
        "settings": [
            {"type": "text", "text": "这些功能仍在实验阶段，尚未完成"},
            "",
            "theme_background",
            "theme_color",
            "theme_foregroundBackground",
            "theme_foregroundBackgroundDark",
            "theme_backgroundBackground",
            "theme_centerBackground",
            "theme_centerTopBackground",
            "theme_centerTopColor",
            "theme_equipmentBackground",
            "theme_equipmentBorder",
            "theme_equipmentDurabilityBackground",
            "theme_tooltipBackground",
            "theme_tooltipColor",
            "theme_menuButtonBackground",
            "theme_menuButtonBackgroundHover",
            "theme_bottombarBackground",
            "theme_skillbarFill",
            "theme_healthbarFill",
            "theme_energybarFill",
            "theme_xpbarFill"
        ]
    },
    "misc": {
        "name": "其他",
        "settings": [
            "saveName"
        ]
    },
    "cheats": {
        "name": "作弊",
        "settings": [
            {"type": "text", "text": "跳过赶路被移到了这里，因为放在前面太像作弊了。"},
            "",
            "skipTravel"
        ]
    },
    "stats": {
        "name": "统计",
        "execute": function(settingsOptionsElement) {
            let text = ""
            text += `游戏时长：${stats['playtime']}\n`
            text += `世界时间：${stats['gametime']}\n\n`

            text += `任务：${completedQuests.length}/${Object.keys(questData).length}\n`
            text += `物品：${(stats['discoveredItems'] ?? []).length}/${Object.keys(itemData).length}\n`
            text += `技能：${Object.keys(skills).length}/${Object.keys(skillData).length}\n`
            text += `成就：${achievements.length}/${Object.keys(achievementData).length}\n`

            if (stats['kills'] && Object.keys(stats['kills']).length > 0) {
                text += `\n击杀：\n`
                for (const [enemy, count] of Object.entries(stats['kills'])) {
                    text += ` - ${enemyData[enemy]['name']}：${count}\n`
                }
                text += "\n"
            }
            settingsOptionsElement.textContent = text
        }
    },
    "exportImport": {
        "name": "导出 / 导入",
        "execute": function(settingsOptionsElement) {
            settingsOptionsElement.textContent = "你可以用这些选项导出或导入你的存档配置。\n"
            const exportButton = document.createElement("button")
            exportButton.textContent = "导出"
            exportButton.addEventListener("click", function() {
                const blob = new Blob([JSON.stringify(settings)], {"type": "application/json"})
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "ArkiviaSettings.json"
                a.click()
                URL.revokeObjectURL(url)
            })
            settingsOptionsElement.appendChild(exportButton)

            const importButton = document.createElement("button")
            importButton.textContent = "导入"
            importButton.addEventListener("click", async function() {
                let file
                if ("showOpenFilePicker" in window) {
                    const [fileHandle] = await window.showOpenFilePicker({
                        "types": [{"description": "Arkivia Settings", "accept": {"application/json": [".json"]}}]
                    })
                    file = await fileHandle.getFile()
                } else {
                    file = await new Promise(function(resolve, reject) {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = ".json"
                        input.click()
                        input.addEventListener("change", function() {
                            resolve(input.files[0])
                        })
                    })
                }

                const text = await file.text()
                settings = JSON.parse(text)
                saveToLocal(settings, "arkivia-settings")
                window.location.reload()
            })
            settingsOptionsElement.appendChild(importButton)
        }
    },
    "saves": {
        "name": "备份存档",
        "execute": function(settingsOptionsElement) {
            settingsOptionsElement.textContent = "这些备份只用于主存档损坏时恢复。版本变化时会自动生成一份新的备份存档。载入这些存档会覆盖你的主存档，所以务必先把你当前的存档也备份一份。"
            for (let i = 1; i <= 3; i++) {
                const save = loadFromLocal(`arkivia-save-backup${i}`)
                
                if (save) {
                    const saveHolder = document.createElement("div")
                    saveHolder.className = "settings-save-holder"

                    const saveTitle = document.createElement("div")
                    saveTitle.className = "settings-save-title"
                    saveTitle.textContent = `备份 ${i} - v${save['version']}`
                    saveHolder.appendChild(saveTitle)

                    const saveData = document.createElement("div")
                    saveData.classNamem = "settings-save-data"
                    let text = ""
                    if (save['timestamp']) {
                        text += `${new Date(save['timestamp'] * 1000).toLocaleString()}\n`
                    }

                    text += `等级 ${xpToLevel(save['xp'])} ${getRank(save['battleStats']['str'] + save['battleStats']['def'] + save['battleStats']['spd'] + save['battleStats']['dex'])} ${save['playerTitle']}\n`
                    saveData.textContent = text
                    saveHolder.appendChild(saveData)

                    const downloadButton = document.createElement("button")
                    downloadButton.className = "settings-save-download"
                    downloadButton.textContent = "下载"
                    downloadButton.addEventListener("click", function() {
                        exportDict(save, "ArkiviaBackup.sav")
                    })
                    saveHolder.appendChild(downloadButton)

                    settingsOptionsElement.appendChild(saveHolder)
                }
            }
        }
    },
    "info": {
        "name": "链接与信息",
        "execute": function(settingsOptionsElement) {
            settingsOptionsElement.innerHTML = "由 Pointless 独立开发\n\nDiscord 服务器：<a href=https://discord.gg/R3DV8ZX5NE target=\"_blank\" rel=\"noopener\">https://discord.gg/R3DV8ZX5NE</a>"
        }
    },
    "close": {
        "name": "关闭菜单",
        "special": {
            "noChangeMenu": true
        },
        "execute": function() {
            document.getElementById("settings").style.display = "none"
        }
    }
}

for (const [setting, value] of Object.entries(settings)) {
    if (settingsData[setting]) {
        if (value !== settingsData[setting]['default']) {
            if (settingsData[setting]['type'] === "toggle") {
                if (value === true && settingsData[setting]['on']) {
                    settingsData[setting]['on']()
                } else if (value === false && settingsData[setting]['off']) {
                    settingsData[setting]['off']()
                }
            } else if (settingsData[setting]['type'] === "color") {
                settingsData[setting]['execute'](value)
            }
        }
    }
}

document.getElementById("settings-button").addEventListener("click", function() {
    if (settingsMenuLoaded === false) {
        settingsMenuLoaded = true
        for (const [submenu, data] of Object.entries(settingsCategories)) {
            const category = document.createElement("button")
            category.className = "settings-category"
            category.textContent = data['name']

            category.addEventListener("click", function() {
                if (data['special'] && data['special']['noChangeMenu']) {
                    if (data['execute']) {
                        data['execute']()
                    }
                    return
                }
                const settingsOptionsElement = document.getElementById("settings-options")
                settingsOptionsElement.replaceChildren()
                
                const settingsOptionsTitle = document.createElement("div")
                settingsOptionsTitle.className = "settings-options-title"
                settingsOptionsTitle.textContent = data['name']
                settingsOptionsElement.appendChild(settingsOptionsTitle)

                if (data['settings']) {
                    function getSettingValue(option) {
                        return settings[option] !== undefined ? settings[option] : settingsData[option]['default'] || false
                    }

                    function checkModified(option) {
                        return settings[option] !== undefined
                    }

                    for (const option of data['settings']) {
                        if (option === "") {
                            settingsOptionsElement.appendChild(document.createElement("br"))
                            continue
                        } else if (typeof option === "object") {
                            if (option['type'] === "text") {
                                const text = document.createElement("div")
                                text.textContent = option['text']
                                settingsOptionsElement.appendChild(text)
                            }
                            continue
                        }
                        
                        const values = settingsData[option]
                        const holder = document.createElement("div")
                        holder.className = "settings-option-holder"
                        if (values['type'] === "toggle") {
                            const toggle = document.createElement("input")
                            toggle.type = "checkbox"
                            toggle.className = "settings-option-checkbox"
                            toggle.checked = getSettingValue(option)

                            toggle.addEventListener("change", function() {
                                if (toggle.checked !== values['default']) {
                                    settings[option] = toggle.checked
                                    text.style.color = "#ffeeaa"
                                } else {
                                    delete settings[option]
                                    text.style.color = ""
                                }

                                if (toggle.checked && values['on']) {values['on']()}
                                if (!toggle.checked && values['off']) {values['off']()}
                                saveToLocal(settings, "arkivia-settings")
                            })

                            holder.appendChild(toggle)

                            const text = document.createElement("span")
                            text.textContent = values['text']
                            if (checkModified(option)) {text.style.color = "#ffeeaa"}
                            holder.appendChild(text)
                        } else if (values['type'] === "text" || values['type'] === "number") {
                            const text = document.createElement("span")
                            text.textContent = values['text']
                            if (checkModified(option)) {text.style.color = "#ffeeaa"}
                            if (values['tooltip']) {
                                text.setAttribute("data-tooltip-title", values['text'])
                                text.setAttribute("data-tooltip-text", values['tooltip'])
                            }
                            holder.appendChild(text)
                            
                            const textInput = document.createElement("input")
                            textInput.type = "text"
                            textInput.className = values['type'] === "number" ? "settings-option-number-input" : "settings-option-text-input"
                            textInput.value = getSettingValue(option)
                            if (values['type'] === "number") {
                                textInput.type = "number"
                            }

                            function finish(mode) {
                                if (textInput.value !== values['default']) {
                                    settings[option] = values['type'] === "number" ? Number(textInput.value) : textInput.value
                                    text.style.color = "#ffeeaa"
                                } else {
                                    delete settings[option]
                                    text.style.color = ""
                                }

                                if (mode === "key") {textInput.blur()}

                                saveToLocal(settings, "arkivia-settings")
                            }

                            textInput.addEventListener("keydown", function(e) {
                                if (e.key === "Enter") {textInput.blur()}
                            })
                            textInput.addEventListener("blur", finish)

                            holder.appendChild(textInput)
                        } else if (values['type'] === "color") {
                            const text = document.createElement("span")
                            text.textContent = values['text']
                            if (checkModified(option)) {text.style.color = "#ffeeaa"}
                            holder.appendChild(text)
                            
                            const colorInput = document.createElement("input")
                            colorInput.type = "color"
                            colorInput.className = "settings-option-color-input"
                            colorInput.value = getSettingValue(option) || "#000000"

                            colorInput.addEventListener("change", function() {
                                if (colorInput.value !== values['default']) {
                                    settings[option] = colorInput.value
                                    text.style.color = "#ffeeaa"
                                } else {
                                    delete settings[option]
                                    text.style.color = ""
                                }
                                if (values['execute']) {values['execute'](colorInput.value)}
                                saveToLocal(settings, "arkivia-settings")
                            })

                            colorInput.addEventListener("input", function() {
                                if (values['execute']) {values['execute'](colorInput.value)}
                            })

                            holder.appendChild(colorInput)

                            const resetButton = document.createElement("button")
                            resetButton.textContent = "重置"

                            resetButton.addEventListener("click", function() {
                                colorInput.value = values['default']
                                delete settings[option]
                                text.style.color = ""
                                if (values['execute']) {values['execute'](colorInput.value)}
                                saveToLocal(settings, "arkivia-settings")
                            })

                            holder.appendChild(resetButton)
                        }
                        settingsOptionsElement.appendChild(holder)   
                    }
                }

                if (data['execute']) {
                    data['execute'](settingsOptionsElement)
                }
            })

            document.getElementById("settings-categories").appendChild(category)
        }
    }

    const settingsElem = document.getElementById("settings")
    if (settingsElem.style.display === "none") {
        settingsElem.style.display = ""
    } else {
        settingsElem.style.display = "none"
    }
})

function objectEmpty(obj) {
    return Object.keys(obj).length === 0
}

// Mobile
function mobileLayout() {
    document.getElementById("mobile-meta").setAttribute("content", "width=device-width, initial-scale=1")
    const link = document.createElement("link")
    link.id = "mobile-layout"
    link.rel = "stylesheet"
    link.href = "mobile.css"
    document.head.appendChild(link)

    document.getElementById("delete-save").textContent = "删"
    document.getElementById("settings-button").textContent = "配置"
    gameTitleElement.textContent = `v${VERSION}`

    const sidebar = document.getElementById("sidebar")
    let startX = 0
    let startY = 0
    let sidebarOpen = false
    eventListenerStorage['mobileTouchstart'] = document.addEventListener("touchstart", function(e) {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
    })

    eventListenerStorage['mobileTouchmove'] = document.addEventListener("touchmove", function(e) {
        sidebar.style.transition = "none"
        if (!sidebarOpen) {
            sidebar.style.transform = `translateX(${Math.max(0, e.touches[0].clientX - startX) - sidebar.offsetWidth}px)`
        } else {
            sidebar.style.transform = `translateX(${Math.min(0, e.touches[0].clientX - startX)}px)`
        }
    })

    eventListenerStorage['mobileTouchend'] = document.addEventListener("touchend", function(e) {
        const endX = e.changedTouches[0].clientX
        const endY = e.changedTouches[0].clientY

        const deltaX = endX - startX
        const deltaY = endY - startY

        if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
            if (sidebarOpen) {
                sidebar.style.transform = "translateX(0%)"
            } else {
                sidebar.style.transform = "translateX(-100%)"
            }
            return
        }

        sidebar.style.transition = "transform 250ms ease-out"

        if (deltaX > 0) {
            sidebarOpen = true
            sidebar.style.transform = "translateX(0%)"
        } else {
            sidebarOpen = false
            sidebar.style.transform = "translateX(-100%)"
        }
    })
}

function desktopLayout() {
    document.getElementById("mobile-layout").remove()
    document.getElementById("mobile-meta").setAttribute("content", "width=1000")
    sidebar.style.transform = ""
    sidebar.style.transition = ""
    document.getElementById("delete-save").textContent = "删除"
    document.getElementById("settings-button").textContent = "设置"
    gameTitleElement.textContent = `Arkivia v${VERSION}`
}

if (!settings['run']) {
    if (window.screen.width < 1000 && window.screen.height * 1.5 > window.screen.width) {
        mobileLayout()
        settings['mobileLayout'] = true
        insertLog("看起来你在使用移动设备，布局已自动切换。你可以在这个配置菜单里改回来。")
        insertLog("向右滑动可打开背包和技能")
    }
}

// Saves
function makeSave() { // Optimisation at all costs
    function removeEmpty(key, obj) {
        if (objectEmpty(obj[key])) {obj[key] = undefined}
    }

    let base = {
        money, time, health, xp, playerTitle, battleStats, skills, energy, noSleepTime, effects, titleScores, achievements, processStatus, // Stats
        inventory, inventoryNonStackable, inventoryNonStackableIncrement, storage, storageNonStackable, storageAccess, shopStorage, // Inventory
        combatStatus, equipment, team, arenaData, // Combat
        oldScene, currentScene, sceneText, region, currentPrependText, // Scenes
        quests, completedQuests, checks, dailyChecks, questProgression, // Quests
        stats, // Stats
        knownRecipes, craftStatus, craftingSelection, // Crafting
        exploreStatus, travelStatus, // Exploration
        debugEnabled, // Debug
        weather, weatherStartTime, // Environment
        processStatus, activeActions // Processes
    }
    base['version'] = VERSION
    // Stats
    if (base['money'] === 0) {delete base['money']}
    for (const [stat, value] of Object.entries(base['battleStats'])) {
        base['battleStats'][stat] = Math.round(value * 1000) / 1000
    }
    base['energy'] = Math.round(base['energy'] * 1000) / 1000
    removeEmpty("skills", base)
    removeEmpty("effects", base)
    for (const [title, value] of Object.entries(base['titleScores'])) {
        base['titleScores'][title] = Math.round(value * 1000) / 1000
    }
    removeEmpty("titleScores", base)
    removeEmpty("achievements", base)
    if (base['processStatus']['type'] === null) {base['processStatus'] = undefined}
    if (!base['currentPrependText']) {base['currentPrependText'] = undefined}

    // Combat
    if (base['combatStatus']['enemy'] === null) {base['combatStatus'] = undefined}
    base['equipment'] = Object.fromEntries(Object.entries(base['equipment']).filter(([key, value]) => value !== null))
    removeEmpty("equipment", base)
    if (base['team'] === "none") {base['team'] = undefined}
    removeEmpty("arenaData", base)
    
    // Inventory
    removeEmpty("inventory", base)
    removeEmpty("inventoryNonStackable", base)
    removeEmpty("storage", base)
    removeEmpty("storageNonStackable", base)
    if (base['storageAccess'] === false) {base['storageAccess'] = undefined}
    if (base['inventoryNonStackableIncrement'] === 0) {base['inventoryNonStackableIncrement'] = undefined}
    if (base['knownRecipes'].length <= 2) {base['knownRecipes'] = undefined} // Hopefully shouldn't break anything
    removeEmpty("shopStorage", base)

    // Quests
    removeEmpty("quests", base)
    removeEmpty("completedQuests", base)
    removeEmpty("checks", base)
    removeEmpty("dailyChecks", base)
    removeEmpty("questProgression", base)

    // Crafting
    if (base['craftStatus']['recipe'] === null && base['craftStatus']['selected'] === null) {base['craftStatus'] = undefined}
    if (base['craftingSelection'] === false) {base['craftingSelection'] = undefined}

    // Exploration
    if (base['exploreStatus']['area'] === null) {base['exploreStatus'] = undefined}
    if (base['travelStatus']['destination'] === null) {base['travelStatus'] = undefined}

    // Debug
    if (base['debugEnabled'] === false) {base['debugEnabled'] = undefined}

    // Environment
    if (base['weather'] === "clear") {
        base['weather'] = undefined
        // base['weatherStartTime'] = undefined
    }

    // Processes
    if (processStatus['type'] === null) {
        base['processStatus'] = undefined
    }
    removeEmpty("activeActions", base)

    // Misc
    base['timestamp'] = Math.round(Date.now() / 1000)

    base = Object.fromEntries(Object.entries(base).filter(([key, value]) => value !== undefined))
    return base
}

function bytesToBinary(bytes) {
    let result = ""
    for (let i = 0; i < bytes.length; i += 16384) {
        result += String.fromCharCode(...bytes.subarray(i, i + 16384))
    }
    return result
}

function saveToLocal(dict, slot="arkivia-save1") {
    const msgpackData = MessagePack.encode(dict)
    const packed = LZString.compressToBase64(bytesToBinary(msgpackData))
    localStorage.setItem(slot, packed)
}

function exportDict(dict, filename="Arkivia.sav") {
    const msgpackData = MessagePack.encode(dict)
    const packed = LZString.compressToUint8Array(bytesToBinary(msgpackData))
    const blob = new Blob([packed], {"type": "application/octet-stream"})

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

async function importDict() {
    let file
    if ("showOpenFilePicker" in window) {
        const [fileHandle] = await window.showOpenFilePicker({
            "types": [{"description": "Arkivia Save", "accept": {"application/octet-stream": [".sav"]}}]
        })
        file = await fileHandle.getFile()
    } else {
        file = await new Promise(function(resolve, reject) {
            const input = document.createElement("input")
            input.type = "file"
            input.accept = ".sav"
            input.click()
            input.addEventListener("change", function() {
                resolve(input.files[0])
            })
        })
    }
    const arrayBuffer = await file.arrayBuffer()
    const compressed = new Uint8Array(arrayBuffer)
    const str = LZString.decompressFromUint8Array(compressed)
    const bytes = new Uint8Array(str.split("").map(c => c.charCodeAt(0)))
    const dict = MessagePack.decode(bytes)
    return dict
}

function loadFromLocal(slot="arkivia-save1") {
    let save = localStorage.getItem(slot)
    if (!save) {return undefined}
    const decompressed = LZString.decompressFromBase64(save)
    const bytes = new Uint8Array(decompressed.split("").map(char => char.charCodeAt(0)))
    const dict = MessagePack.decode(bytes)
    return dict
}

function versionCompare(v1, v2) {
    return v1.localeCompare(v2, undefined, {"numeric": true}) < 0
}

function loadSave(dict) {
    const startTime = performance.now()
    let hasUpdate = false
    try {
        if (versionCompare(dict['version'], VERSION)) {
            for (let i = 3; i > 1; i--) {
                const previous = localStorage.getItem(`arkivia-save-backup${i - 1}`)
        
                if (previous) {
                    localStorage.setItem(`arkivia-save-backup${i}`, previous)
                }
            }
            saveToLocal(dict, "arkivia-save-backup1")
            gameTitleElement.textContent = `Arkivia v${VERSION}（更新）`
            gameTitleElement.classList.add("update")
            gameTitleElement.addEventListener("click", function() {
                gameTitleElement.textContent = `Arkivia v${VERSION}`
                gameTitleElement.classList.remove("update")
            }, {"once": true})
            setTimeout(function() {
                gameTitleElement.textContent = `Arkivia v${VERSION}`
                gameTitleElement.classList.remove("update")
            }, 20000)
            hasUpdate = true
        }

        // Migrations
        if (versionCompare(dict['version'], "0.17")) {
            combatStatus['enemyEffects'] ??= []
        }
        if (versionCompare(dict['version'], "0.19")) {
            dict['stats']['totalKills'] = Object.values(dict['stats']['kills']).reduce((acc, val) => acc + val, 0)
        }
        if (versionCompare(dict['version'], "0.20")) {
            if (dict.checks?.dojoQuestIndex) {
                dict['questProgression'] = {"dojo": dict['checks']['dojoQuestIndex']}
                delete dict['checks']['dojoQuestIndex']
            }
            if (dict['combatStatus']) {
                dict['combatStatus']['enemyEffects'] = {}
            }
        }
        if (versionCompare(dict['version'], "0.23")) {
            delete dict['equipment']['shield']
            dict['equipment']['tool'] = null
        }
        if (versionCompare(dict['version'], "0.24")) {
            dict['travelStatus'] = dict['travelInfo']
            dict['combatStatus'] = dict['combatData']
            dict['craftStatus'] = dict['craftInfo']
            dict['exploreStatus'] = dict['exploreData']
        } if (versionCompare(dict['version'], "0.27")) {
            for (const [effect, data] of Object.entries(dict['effects'] ?? {})) {
                if (data['duration'] !== undefined) {
                    data['end'] = data['duration']
                    delete data['duration']
                }
            }

            if (dict['combatStatus'] && dict['combatStatus']['enemyEffects']) {
                for (const [effect, data] of Object.entries(dict['combatStatus']['enemyEffects'])) {
                    if (data['duration'] !== undefined) {
                        data['end'] = data['duration']
                        delete data['duration']
                    }
                }
            }

            // console.log(dict['arenaData']['round'] >= 7)
            if (dict['arenaData'] && dict['arenaData']['round'] >= 7) {
                dict['arenaData'] = {}
                dict['currentScene'] = "empty"
                dict['sceneText'] = `${colorGen("#ff99ff", "由于旧版本的 bug 会导致卡死，你已被传送出竞技场")}\n\n{继续|theArenaEntrance}`
            }
        }
        
        // Stats
        time = dict['time'] ?? time
        battleStats = dict['battleStats'] ?? battleStats
        energy = dict['energy'] ?? energy
        noSleepTime = dict['noSleepTime'] ?? noSleepTime
        for (const [title, score] of Object.entries(dict['titleScores'] ?? {})) {
            if (Number.isNaN(score)) {
                delete dict['titleScores'][title]
            }
        }
        titleScores = dict['titleScores'] ?? titleScores
        stats = dict['stats'] ?? stats
        if (dict['playerTitle'] !== "未知") {changeTitle(dict['playerTitle'])}
        processStatus = dict['processStatus'] ?? processStatus

        changeXp(dict['xp'])
        changeMoney(dict['money'] || 0)
        health = dict['health']
        updateBar("health")
        updateBar("energy")
        timeElement.textContent = formatTime(time)

        if (dict['skills']) {
            for (const [skill, xp] of Object.entries(dict['skills'])) {
                if (!Number.isNaN(xp)) {
                    changeSkill(skill, xp)
                }
            }
        }

        if (dict['effects']) {
            for (const [effect, data] of Object.entries(dict['effects'])) {
                changeEffect(effect, data['end'] || 0, true, data['properties'] || null)
            }
        }
        achievements = dict['achievements'] ?? achievements
        if (dict['achievements']) {document.getElementById("achievements-button").style.display = ""}
        
        // Inventory
        inventoryNonStackableIncrement = dict['inventoryNonStackableIncrement'] ?? inventoryNonStackableIncrement
        shopStorage = dict['shopStorage'] ?? shopStorage
        
        const inventoryCombined = [
            ...Object.entries(dict['inventory'] ?? {}).map(([item, amount]) => ({item, amount, "id": null, "data": null})),
            ...Object.entries(dict['inventoryNonStackable'] ?? {}).map(([id, data]) => ({"item": data['name'], "amount": 1, id, data}))
        ]

        const storageCombined = [
            ...Object.entries(dict['storage'] ?? {}).map(([item, amount]) => ({item, amount, "id": null, "data": null})),
            ...Object.entries(dict['storageNonStackable'] ?? {}).map(([id, data]) => ({"item": data['name'], "amount": 1, id, data}))
        ]

        inventoryCombined.sort(function(a, b) {
            const itemA = itemData[a['item']]
            const itemB = itemData[b['item']]
            return itemA['class'] < itemB['class'] ? -1 : itemA['class'] > itemB['class'] ? 1 : itemA['name'] < itemB['name'] ? -1 : itemA['name'] > itemB['name'] ? 1 : 0
        })

        storageCombined.sort(function(a, b) {
            const itemA = itemData[a['item']]
            const itemB = itemData[b['item']]
            return itemA['class'] < itemB['class'] ? -1 : itemA['class'] > itemB['class'] ? 1 : itemA['name'] < itemB['name'] ? -1 : itemA['name'] > itemB['name'] ? 1 : 0
        })

        const fragment = new DocumentFragment()
        for (const item of inventoryCombined) {
            changeInventory(item['item'], item['amount'], item['id'], item['data'], {"fragment": fragment, "ignoreWeightLimit": true})
        }
        document.getElementById("inventory-table").appendChild(fragment)

        // for (const [item, amount] of Object.entries(dict['inventory'] ?? {})) {
        //     changeInventory(item, amount)
        // }
        // for (const [item, amount] of Object.entries(dict['storage'] ?? {})) {
        //     changeStorage(item, amount)
        // }

        // for (const [id, data] of Object.entries(dict['inventoryNonStackable'] ?? {})) {
        //     const item = data['name']
        //     changeInventory(item, 1, id, data)
        // }
        // for (const [id, data] of Object.entries(dict['storageNonStackable'] ?? {})) {
        //     const item = data['name']
        //     changeStorage(item, 1, id, data)
        // }

        for (const item of storageCombined) {
            changeStorage(item['item'], item['amount'], item['id'], item['data'])
        }

        for (const [item, data] of Object.entries(dict['equipment'] ?? {})) {
            if (data !== null) {
                changeEquipment(data[1])
            }
        }
        
        // Combat
        combatStatus = dict['combatStatus'] ?? combatStatus
        team = dict['team'] ?? team
        arenaData = dict['arenaData'] ?? arenaData

        if (combatStatus['enemy'] !== null) {
            let total = 0
            for (const stat of statTypes) {
                total += combatStatus['enemyStats'][stat]
                document.getElementById(`enemy-stat-${stat}`).textContent = `${capitaliseFirst(stat)}：${formatNumber(combatStatus['enemyStats'][stat], "floor", true)}`
            }
            document.getElementById(`enemy-stat-total`).textContent = `总值：${formatNumber(total, "floor", true)}`

            document.getElementById("enemy-name").textContent = enemyData[combatStatus['enemy']]['name']
            updateBar("enemyHealth")

            document.getElementById("attack-info-left").style.display = ""
            document.getElementById("attack-info-divider").style.display = ""
            document.getElementById("attack-info-right").style.display = ""

            if (combatStatus['enemyEffects']) {
                for (const [effect, data] of Object.entries(dict['combatStatus']['enemyEffects'])) {
                    delete combatStatus['enemyEffects'][effect]
                    changeEnemyEffect(effect, data['end'] || 0, true)
                }
            }
        }

        // Scenes
        oldScene = dict['oldScene'] ?? oldScene
        currentScene = dict['currentScene'] ?? currentScene
        sceneText = dict['sceneText'] ?? sceneText
        region = dict['region'] ?? region

        // Quests
        quests = dict['quests'] ?? quests
        completedQuests = dict['completedQuests'] ?? completedQuests
        checks = dict['checks'] ?? checks
        dailyChecks = dict['dailyChecks'] ?? dailyChecks
        questProgression = dict['questProgression'] ?? questProgression

        if (dict['quests']) {
            for (const quest in dict['quests']) {
                giveQuest(quest)
            }
        }

        if (dict['completedQuests']) {
            for (const quest of dict['completedQuests']) {
                giveQuest(quest, complete=true)
            }
        }

        // Crafting
        knownRecipes = dict['knownRecipes'] ?? knownRecipes
        craftStatus = dict['craftStatus'] ?? craftStatus
        craftingSelection = dict['craftingSelection'] ?? craftingSelection

        if (dict['craftStatus']) {
            for (const itemId of dict['craftStatus']['using']) {
                const inventorySlot = document.getElementById(`item-${inventoryNonStackable[itemId]['name']}_${itemId}`)
                if (inventorySlot) {
                    const itemSelected = document.createElement("span")
                    itemSelected.className = "item-selected"
                    itemSelected.textContent = "S"

                    inventorySlot.appendChild(itemSelected)
                }
            }
        }

        // Exploration
        exploreStatus = dict['exploreStatus'] ?? exploreStatus
        travelStatus = dict['travelStatus'] ?? travelStatus

        // Debug
        if (dict['debugEnabled']) {toggleDebug(true)}

        // Environment
        if (dict['weather']) {
            changeWeather(dict['weather'])
        }
        if (dict['weatherStartTime']) {
            weatherStartTime = dict['weatherStartTime']
        }

        // Processes
        activeActions = dict['activeActions'] ?? activeActions

        // End
        if (sceneText && window.ARK_LANG && scenes[currentScene] && (/[\u4e00-\u9fa5]/.test(String(sceneText)) !== (window.ARK_LANG !== "en"))) {
            try {sceneText = scenes[currentScene]()} catch (e) {}
        }
        processText(sceneText)
        generateActions()
        if (dict['currentPrependText']) {
            changePrependText(dict['currentPrependText'])
        }
        if (sceneEndFunctions[currentScene]) {sceneEndFunctions[currentScene]()}

        document.getElementById("log").replaceChildren()
        itemLogStackData = {"id": null, "item": null, "amount": null, "type": null}

        insertLog(colorGen("#aaaaaa", `载入用时 ${(performance.now() - startTime).toFixed()}ms`))
        if (hasUpdate) {
            insertLog(colorGen("#ffff00", `游戏已从 v${dict['version']} 更新至 v${VERSION}。如果出现问题，请在设置里恢复备份存档。`))
            insertLog(colorGen("#cccc00", "游戏仍在测试阶段，请经常导出存档"))
        }
    } catch (error) {
        saveEnabled = false
        insertLog(colorGen("#ff0000", `载入失败：${error}`))
        throw error
    }
}

document.getElementById("delete-save").addEventListener("click", function() {
    let confirm = prompt("这会删除你的存档。请输入 CONFIRM 来确认")
    if (confirm) {
        if (confirm.toLowerCase() === "confirm") {
            saveEnabled = false
            localStorage.removeItem("arkivia-save1")
            localStorage.removeItem("save1") // Remove this later
            window.location.reload()
        } else if (confirm.toLowerCase() === "confirm to confirm") {
            alert(`我说的是 “confirm”，不是 “confirm to confirm”`)
        }
    }
})

document.getElementById("export").addEventListener("click", function() {
    if (!settings['saveName']) {
        exportDict(makeSave())
    } else {
        exportDict(makeSave(), formatString(settings['saveName'], {
            "realYear": new Date().getFullYear(),
            "realMonth": new Date().getMonth() + 1,
            "realDay": new Date().getDate(),
            "realHours": new Date().getHours(),
            "realMinutes": new Date().getMinutes(),
            "realSeconds": new Date().getSeconds(),
            "timestamp": Math.floor(Date.now() / 1000),
            "day": getDay(),
            "version": VERSION.replaceAll(".", "")
        }))
    }
})

document.getElementById("import").addEventListener("click", function() {
    importDict().then(dict => {
        saveToLocal(dict, "arkivia-savetemp")
        window.location.reload()
    })
})

let firstDebugEnable = true // Putting this here so it doesn't break

if (localStorage.getItem("arkivia-savetemp") === null) {
    if (localStorage.getItem("arkivia-save1") === null && localStorage.getItem("save1") === null) {
        sceneManager("intro1")
    } else {
        let save = loadFromLocal()
        if (save === undefined) {save = loadFromLocal("save1")}
        loadSave(save)
    }
} else {
    loadSave(loadFromLocal("arkivia-savetemp"))
    localStorage.removeItem("arkivia-savetemp")
}

window.addEventListener("beforeunload", function() {
    if (saveEnabled === true && currentScene !== "intro1") {
        saveToLocal(makeSave())
    }
})

// Debug
function toggleDebug(value) {
    if (value === true) {
        document.getElementById("debug-button").style.display = ""
        debugEnabled = true
        if (firstDebugEnable) {
            document.addEventListener("keydown", function(e) {
                if (e.key === "Shift" && !e.repeat) {
                    tickDelay = 100
                }
            })

            document.addEventListener("keyup", function(e) {
                if (e.key === "Shift") {
                    tickDelay = document.getElementById("debug-settings-tickDelay").value
                }
            })
        }
        firstDebugEnable = false
    } else {
        document.getElementById("debug-button").style.display = "none"
        if (document.getElementById("sidebar-menu-debug").style.display !== "none") {
            document.getElementById("sidebar-menu-debug").style.display = "none"
            document.getElementById("sidebar-menu-inventory").style.display = ""
            document.getElementById("inventory-button").style.borderColor = "#7777cc"
            document.getElementById("debug-button").style.borderColor = ""
        }
        debugEnabled = false
    }
}

for (const stat of statTypes) {
    document.getElementById(`debug-change-${stat}`).addEventListener("click", function() {
        changeBattlestat(stat, Number(document.getElementById("debug-stat-input").value), true)
    })
}

document.getElementById("debug-reload-scene").addEventListener("click", function() {
    playTransition()
    sceneManager(currentScene)
})

const allScenes = Object.getOwnPropertyNames(scenes).filter(prop => typeof scenes[prop] === "function")
const suggestionsContainer = document.getElementById("debug-scene-jump-autocomplete-suggestions")
const sceneJumpInput = document.getElementById("debug-scene-jump-input")
let selectedIndex = -1

sceneJumpInput.addEventListener("input", function(e) {
    const query = sceneJumpInput.value.toLowerCase()
    if (suggestionsContainer.firstChild) {
        while (suggestionsContainer.firstChild) {
            suggestionsContainer.removeChild(suggestionsContainer.lastChild)
        }
    }

    selectedIndex = -1
    const filteredData = allScenes.filter(item => item.toLowerCase().includes(query))
    let i = 0
    for (const item of filteredData) {
        const suggestion = document.createElement("div")
        suggestion.className = "suggestion"
        suggestion.textContent = item

        suggestion.addEventListener("click", function() {
            sceneJumpInput.value = item
            suggestionsContainer.replaceChildren()
        })

        suggestionsContainer.appendChild(suggestion)
        i += 1
        if (i >= 20) {
            break
        }
    }
})

function updateSelection(suggestions) {
    suggestions.forEach(function(suggestion, index) {
        suggestion.classList.remove("selected")
        if (index === selectedIndex) {
            suggestion.classList.add("selected")
        }
    })
}

sceneJumpInput.addEventListener("keydown", function(e) {
    const suggestions = document.querySelectorAll(".suggestion")

    if (e.key === "ArrowDown") {
        if (selectedIndex < suggestions.length - 1) {
            selectedIndex += 1
            updateSelection(suggestions)
        }
    } else if (e.key === "ArrowUp") {
        if (selectedIndex > 0) {
            selectedIndex -= 1
            updateSelection(suggestions)
        }
    } else if (e.key === "Enter" && selectedIndex >= 0) {
        sceneJumpInput.value = suggestions[selectedIndex].textContent
        suggestionsContainer.innerHTML = ""
        selectedIndex = -1
    } else if (e.key === "Enter") {
        playTransition()
        sceneManager(sceneJumpInput.value)
        sceneJumpInput.value = ""
        suggestionsContainer.replaceChildren()
    }
})

document.getElementById("debug-settings-tickDelay").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        tickDelay = this.value
        this.blur()
    }
})

updateBar("health")
updateBar("xp")
updateBattlestats()
if (!settings['run']) {
    settings['run'] = true
    saveToLocal(settings, "arkivia-settings")
}