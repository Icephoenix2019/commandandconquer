var aircraft = {
  type: 'aircraft',
  list: {
    orca: {
      name: 'orca',
      label: 'Orca Assault Craft',
      speed: 40,
      turnSpeed: 8,
      armor: 3,
      primaryWeapon: 'rocket',
      cost: 1200,
      sight: 0,
      maxAmmunition: 6,
      ammunition: 6,
      dependency: ['helipad'],
      constructedIn: ['helipad'],
      owner: 'gdi',
      hitPoints: 125,
      directions: 32,
      deathAnimation: 'frag1',
      spriteImages: [{
        name: 'stand',
        count: 32
      }, {
        name: 'attack',
        count: 32
      }],
      pixelOffsetX: -12,
      pixelOffsetY: -18,
      selectOffsetX: -7,
      selectOffsetY: -16,
      pixelHeight: 25,
      pixelWidth: 36,
      firesTwice: true,
      softCollisionRadius: 8,
      hardCollisionRadius: 5
    },
    c17: {
      name: 'orca',
      label: 'Orca Assault Craft',
      speed: 40,
      turnSpeed: 5,
      armor: 2,
      cannotTurnSharp: true,
      primaryWeapon: 'napalm',
      cost: 800,
      sight: 0,
      salvos: 2,
      z: 1,
      maxAmmunition: 5,
      ammunition: 5,
      owner: 'both',
      hitPoints: 25,
      directions: 32,
      deathAnimation: 'frag1',
      spriteImages: [{
        name: 'stand',
        count: 32
      }],
      action: 'stand',
      pixelOffsetX: -24,
      pixelOffsetY: -24,
      selectOffsetX: -7,
      selectOffsetY: -16,
      pixelHeight: 48,
      pixelWidth: 48,
      firesTwice: false,
      softCollisionRadius: 7,
      hardCollisionRadius: 10,
      processOrders: function () {
        this.lifeCode = getLifeCode(this)
        if (this.lifeCode == 'dead') {
          game.remove(this)
          game.add({
            type: 'effects',
            name: this.deathAnimation,
            x: this.x,
            y: this.y - this.z
          })
          sounds.play('xplosml2')
          game.kills[this.attackedBy]++
          game.deaths[this.player]++
          return
        }
        this.sight = this.z == 0 ? 1 : 0
        this.lastMovementX = 0
        this.lastMovementY = 0
        if (this.weapon && this.weapon.cooldown > 0) {
          this.weapon.cooldown--
        }
        switch (this.orders.type) {
          case 'bomb':
            this.moveTo(this.orders.to)
            if (Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 3) {
              if (this.ammunition > 0 && this.weapon.cooldown <= 0) {
                this.ammunition--
                this.weapon.fire(this)
              } else if (this.ammunition === 0 && this.salvos === 0) {
                this.orders = {
                  type: 'exit',
                  to: this.orders.from
                }
              }
            } else {
              this.moveTo(this.orders.to)
            }
            break
          case 'exit':
            if (Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 0.2) {
              game.remove(this)
            } else {
              this.moveTo(this.orders.to)
            }
            break
        }
      }
    },
    apache: {
      name: 'apache',
      label: 'Apache Attack Helicopter',
      speed: 40,
      turnSpeed: 4,
      armor: 3,
      primaryWeapon: 'chaingun',
      cost: 1200,
      sight: 0,
      maxAmmunition: 6,
      ammunition: 6,
      dependency: ['helipad'],
      constructedIn: ['helipad'],
      owner: 'nod',
      hitPoints: 125,
      directions: 32,
      deathAnimation: 'frag1',
      spriteImages: [{
        name: 'stand',
        count: 32
      }],
      pixelOffsetX: -23,
      pixelOffsetY: -20,
      selectOffsetX: -13,
      selectOffsetY: -16,
      pixelHeight: 29,
      pixelWidth: 46,
      softCollisionRadius: 8,
      hardCollisionRadius: 5
    },
    chinook: {
      name: 'chinook',
      label: 'Chinook Assault Craft',
      speed: 30,
      turnSpeed: 5,
      armor: 2,
      cost: 1500,
      sight: 0,
      maxCargo: 5,
      z: 1,
      dependency: ['helipad'],
      constructedIn: ['helipad'],
      owner: 'both',
      hitPoints: 90,
      directions: 32,
      deathAnimation: 'frag1',
      spriteImages: [{
        name: 'stand',
        count: 32
      }, {
        name: 'load',
        count: 4
      }],
      pixelOffsetX: -24,
      pixelOffsetY: -24,
      selectOffsetX: -12,
      selectOffsetY: -12,
      pixelHeight: 48,
      pixelWidth: 48,
      softCollisionRadius: 10,
      hardCollisionRadius: 8,
      animate: function () {
        this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight
        if (this.action == 'load') {
          this.imageList = this.spriteArray['load']
          this.imageOffset = this.imageList.offset + this.animationIndex
          if (this.animationIndex < this.imageList.count - 1) {
            this.animationIndex++
          }
        } else if (this.action == 'close') {
          this.imageList = this.spriteArray['load']
          this.imageOffset = this.imageList.offset + this.imageList.count - 1 - this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.action = 'move'
            this.animationIndex = 0
          }
        } else {
          this.imageList = this.spriteArray['stand']
          this.imageOffset = this.imageList.offset + Math.floor(this.direction)
        }
      }
    }
  },
  defaults: {
    action: 'stand',
    z: 0,
    orders: {
      type: 'stand'
    },
    direction: 32,
    animationIndex: 0,
    selected: false,
    path: undefined,
    lastMovementX: 0,
    lastMovementY: 0,
    spriteSheet: undefined,
    findEnemyInRange: findEnemyInRange,
    checkCollision: checkCollision,
    moveTo: function (goal) {
      if (this.helipad) {
        if (this.helipad.docked == this) {
          this.helipad.docked = undefined
        }
        this.helipad = undefined
      }
      this.lastMovementX = 0
      this.lastMovementY = 0
      var destination = {
        x: goal.x,
        y: goal.y,
        type: goal.type
      }
      if (destination.type == 'buildings') {
        destination.y = goal.cgY
        destination.x = goal.cgX
      }
      if (this.z < 1) {
        this.z += 1 / 16
      }
      var newDirection = findAngle(destination, this, this.directions)
      var turnAmount = Math.abs(angleDiff(this.direction, newDirection, this.directions))
      if (turnAmount >= 1 && !(this.firing && this.name == 'c17')) {
        this.turnTo(newDirection)
      }
      var movement, angleRadians
      this.colliding = false
      if (this.z >= 1 && (this.cannotTurnSharp || Math.abs(angleDiff(newDirection, this.direction, this.directions)) < this.directions / 4)) {
        var distance = Math.sqrt(Math.pow(destination.x - this.x, 2) + Math.pow(destination.y - this.y, 2))
        movement = this.speed / game.gridSize / game.speedAdjustmentFactor
        if (distance < movement) {
          distance = movement
        }
        angleRadians = this.direction / this.directions * 2 * Math.PI
        this.lastMovementX = -roundFloating(movement * Math.sin(angleRadians))
        this.lastMovementY = -roundFloating(movement * Math.cos(angleRadians))
        this.x = this.x + this.lastMovementX
        this.y = this.y + this.lastMovementY
      }
      return true
    },
    processOrders: function () {
      this.lifeCode = getLifeCode(this)
      if (this.lifeCode == 'dead') {
        game.remove(this)
        game.add({
          type: 'effects',
          name: this.deathAnimation,
          x: this.x,
          y: this.y - this.z
        })
        sounds.play('xplosml2')
        game.kills[this.attackedBy]++
        return
      }
      this.sight = this.z == 0 ? 1 : 0
      var enemy
      this.lastMovementX = 0
      this.lastMovementY = 0
      this.firing = false
      if (this.weapon && this.weapon.cooldown > 0) {
        this.weapon.cooldown--
      }
      switch (this.orders.type) {
        case 'stand':
          if (this.z === 0) {
            break
          }
          if (!isEmptySpot(this)) {
            this.orders = {
              type: 'move',
              to: findClosestEmptySpot({
                x: Math.floor(this.x) + 0.5,
                y: Math.floor(this.y) + 0.5
              })
            }
            break
          }
          if (this.name === 'chinook' && this.direction != 0) {
            this.turnTo(0)
            break
          }
          if (this.z > 0) {
            this.z -= 1 / 16
          }
          break
        case 'load':
          if (this.z > 0) {
            this.orders.type = 'stand'
            break
          }
          if (this.cargo.length == this.maxCargo) {
            this.orders.type == 'stand'
            this.action = 'close'
            break
          }
          if (this.action != 'load') {
            this.action = 'load'
            this.animationIndex = 0
          }
          this.orders.type = 'stand'
          break
        case 'finish-load':
          if (this.orders.counter == undefined) {
            this.orders.counter = 50
          }
          if (this.orders.counter) {
            this.orders.counter--
          } else {
            this.action = 'close'
            this.animationIndex = 0
            this.orders.type = 'stand'
          }
          break
        case 'unload':
          if (this.cargo.length === 0) {
            this.orders.type = 'stand'
            break
          }
          if (this.action !== 'load') {
            this.action = 'load'
            this.animationIndex = 0
          } else {
            if (this.animationIndex == this.imageList.count - 1) {
              var emptySpot = findClosestEmptySpot(this)
              var x = emptySpot.x - 0.5
              var y = emptySpot.y
              var toggle = false
              while (this.cargo.length) {
                var soldier = this.cargo.pop()
                soldier.x = x
                soldier.y = y + (toggle ? 0.25 : 0)
                toggle = !toggle
                x = x + 0.25
                game.add(soldier)
              }
              this.orders = {
                type: 'finish-load'
              }
            }
          }
          break
        case 'hunt':
        case 'guard':
          enemy = this.findEnemyInRange()
          if (this.primaryWeapon && enemy) {
            this.orders = {
              type: 'attack',
              to: enemy,
              lastOrder: this.orders
            }
          }
          break
        case 'patrol':
          if (Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 0.2) {
            this.orders = {
              type: 'patrol',
              from: this.orders.to,
              to: this.orders.from
            }
          } else {
            this.moveTo(this.orders.to)
          }
          enemy = this.findEnemyInRange()
          break
        case 'move':
          this.action = 'stand'
          if (Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 0.2) {
            this.orders = {
              type: 'stand'
            }
          } else {
            this.moveTo(this.orders.to)
          }
          break
        case 'return':
          this.action = 'stand'
          if (!this.orders.helipad) {
            this.orders.helipad = this.findHelipadInRange(false) || this.findHelipadInRange(true)
            if (!this.orders.helipad) {
              this.orders = {
                type: 'stand'
              }
              break
            }
          }
          if (Math.pow(this.orders.helipad.cgX - this.x, 2) + Math.pow(this.orders.helipad.cgY - this.y, 2) < 0.1) {
            this.helipad = this.orders.helipad
            this.x = this.orders.helipad.cgX
            this.y = this.orders.helipad.cgY
            this.orders = {
              type: 'dock'
            }
          } else {
            if (Math.sqrt(Math.pow(this.orders.helipad.cgX - this.x, 2) + Math.pow(this.orders.helipad.cgY - this.y, 2)) < 3) {
              if (!this.orders.helipad.docked) {
                this.orders.helipad.docked = this
              }
              if (this.orders.helipad.docked != this) {
                this.orders.helipad = this.findHelipadInRange(false)
                if (!this.orders.helipad) {
                  this.orders = {
                    type: 'stand'
                  }
                  break
                }
              }
            }
            this.moveTo(this.orders.helipad)
          }
          break
        case 'dock':
          this.action = 'stand'
          if (this.z > 0) {
            this.z -= 1 / 16
          }
          break
        case 'attack':
          if (!this.orders.to || !this.canAttackEnemy(this.orders.to) || !this.ammunition) {
            this.orders = {
              type: 'return'
            }
            return
          }
          this.action = 'stand'
          if (this.z < 1) {
            this.z += 1 / 16
            return
          }
          if (Math.pow(this.orders.to.cgX - this.x, 2) + Math.pow(this.orders.to.cgY - this.y, 2) < Math.pow(this.weapon.range - 1, 2)) {
            this.action = 'attack'
            var newDirection = findAngle(this.orders.to, this, this.directions)
            var turnAmount = Math.abs(angleDiff(this.direction, newDirection, this.directions))
            if (turnAmount > 2) {
              this.turnTo(newDirection)
            } else {
              if (this.weapon.cooldown <= 0 && this.ammunition) {
                this.weapon.fire(this, this.direction, this.orders.to)
                this.ammunition--
              }
            }
          } else {
            this.moveTo(this.orders.to)
          }
          break
      }
      this.cgX = this.x
      this.cgY = this.y
    },
    findHelipadInRange: function (docked) {
      var lastDistance
      var lastItem
      if (!docked) {
        for (var i = 0; i < game.buildings.length; i++) {
          var item = game.buildings[i]
          if (item.name == 'helipad' && item.player == this.player && !item.docked) {
            var distance = Math.pow(item.cgX - this.x, 2) + Math.pow(item.y - this.y, 2)
            if (!lastItem || lastDistance > distance) {
              lastDistance = distance
              lastItem = item
            }
          }
        }
      } else {
        for (var i = 0; i < game.buildings.length; i++) {
          var item = game.buildings[i]
          if (item.name == 'helipad' && item.player == this.player) {
            var distance = Math.pow(item.cgX - this.x, 2) + Math.pow(item.y - this.y, 2)
            if (!lastItem || lastDistance > distance) {
              lastDistance = distance
              lastItem = item
            }
          }
        }
      }
      return lastItem
    },
    canAttackEnemy: canAttackEnemy,
    drawSelection: function () {
      var x = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft + this.selectOffsetX
      var y = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop + this.selectOffsetY
      game.foregroundContext.drawImage(this.selectImage, x, y)
      var selectBarHeight = 4
      var selectBarWidth = this.selectImage.width
      game.foregroundContext.beginPath()
      game.foregroundContext.rect(x, y - selectBarHeight - 3, selectBarWidth * this.life / this.hitPoints, selectBarHeight)
      if (this.lifeCode == 'healthy') {
        game.foregroundContext.fillStyle = 'lightgreen'
      } else if (this.lifeCode == 'damaged') {
        game.foregroundContext.fillStyle = 'yellow'
      } else {
        game.foregroundContext.fillStyle = 'red'
      }
      game.foregroundContext.fill()
      game.foregroundContext.beginPath()
      game.foregroundContext.strokeStyle = 'black'
      game.foregroundContext.rect(x, y - selectBarHeight - 3, selectBarWidth, selectBarHeight)
      game.foregroundContext.stroke()
      if (this.name == 'orca') {
        game.foregroundContext.beginPath()
        game.foregroundContext.fillStyle = 'lightyellow'
        game.foregroundContext.strokeStyle = 'black'
        for (var i = 0; i < this.maxAmmunition; i++) {
          game.foregroundContext.rect(x + 3 + i * 3.5, y + 18, 3, 3)
          if (i < this.ammunition) {
            game.foregroundContext.fill()
          }
          game.foregroundContext.stroke()
        }
      } else if (this.name == 'chinook') {
        game.foregroundContext.beginPath()
        game.foregroundContext.fillStyle = 'red'
        game.foregroundContext.strokeStyle = 'black'
        for (var i = 0; i < this.maxCargo; i++) {
          game.foregroundContext.rect(x + 2 + i * 4, y + 18, 4, 4)
          if (i < this.cargo.length) {
            game.foregroundContext.fill()
          }
          game.foregroundContext.stroke()
        }
      }
      if (game.debugMode) {
        game.foregroundContext.fillText(this.orders.type, x + 9, y)
      }
    },
    draw: function () {
      this.interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX
      this.interpolatedY = this.y - this.z + game.movementInterpolationFactor * this.lastMovementY
      var x = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft
      var y = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop
      if (x < -this.pixelWidth + this.pixelOffsetX || y < -this.pixelHeight + this.pixelOffsetY || x > game.viewportWidth + this.pixelWidth - this.pixelOffsetX || y > game.viewportHeight + this.pixelHeight - this.pixelOffsetY) {
        return
      }
      game.foregroundContext.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, x + this.pixelOffsetX, y + this.pixelOffsetY, this.pixelWidth, this.pixelHeight)
      if (this.selected) {
        this.drawSelection()
      }
    },
    animate: function () {
      this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight
      this.imageList = this.spriteArray[this.name == 'orca' ? this.action : 'stand']
      this.imageOffset = this.imageList.offset + Math.floor(this.direction)
    },
    turnTo: function (toDirection) {
      if (toDirection > this.direction && toDirection - this.direction < this.directions / 2 || toDirection < this.direction && this.direction - toDirection > this.directions / 2) {
        this.direction = this.direction + this.turnSpeed / 10
      } else {
        this.direction = this.direction - this.turnSpeed / 10
      }
      if (this.direction > this.directions - 1) {
        this.direction -= this.directions - 1
      } else if (this.direction < 0) {
        this.direction += this.directions - 1
      }
    }
  },
  add: function (details) {
    var item = {}
    var name = details.name
    if (name == 'chinook') {
      item.cargo = []
    }
    $.extend(item, this.defaults)
    $.extend(item, this.list[name])
    $.extend(item, details)
    item.weapon = weapons.add({
      name: item.primaryWeapon
    })
    if (item.percentLife) {
      item.life = item.hitPoints * item.percentLife
      delete item.percentLife
    } else {
      item.life = item.hitPoints
    }
    return item
  },
  load: function (name) {
    var item = this.list[name]
    console.log('Loading', name, '...')
    item.spriteCanvas = document.createElement('canvas')
    item.spriteSheet = loader.loadImage('images/' + this.type + '/' + name + '-sprite-sheet.png', function (image) {
      createSpriteSheetCanvas(image, item.spriteCanvas, name == 'harvester' || name == 'mcv' ? 'colormap' : 'grayscale')
    })
    item.spriteArray = []
    item.spriteCount = 0
    item.selectImage = loader.loadImage('images/sidebar/select-1-1.png')
    for (var i = 0; i < item.spriteImages.length; i++) {
      var constructImageCount = item.spriteImages[i].count
      var constructImageName = item.spriteImages[i].name
      if (item.spriteImages[i].direction) {
        for (var j = 0; j < item.directions; j++) {
          item.spriteArray[constructImageName + '-' + j] = {
            name: constructImageName + '-' + j,
            count: constructImageCount,
            offset: item.spriteCount
          }
          item.spriteCount += constructImageCount
        }
      } else {
        item.spriteArray[constructImageName] = {
          name: constructImageName,
          count: constructImageCount,
          offset: item.spriteCount
        }
        item.spriteCount += constructImageCount
      }
    }
  }
}
var buildings = {
  type: 'buildings',
  list: {
    helipad: {
      z: -1,
      name: 'helipad',
      label: 'Helipad',
      cost: 1500,
      powerOut: 10,
      powerIn: 0,
      sight: 3,
      hasBib: true,
      hitPoints: 800,
      armor: 1,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant', 'barracks|hand-of-nod'],
      owner: 'both',
      spriteImages: [{
        name: 'healthy-reload-ammo',
        count: 7
      }, {
        name: 'damaged-reload-ammo',
        count: 7
      }, {
        name: 'ultra-damaged',
        count: 1
      }, {
        name: 'build',
        count: 20
      }, {
        name: 'healthy',
        count: 1,
        spriteCount: 0
      }, {
        name: 'damaged',
        count: 1,
        spriteCount: 7
      }],
      gridShape: [
        [1, 1],
        [1, 1]
      ],
      pixelWidth: 48,
      pixelHeight: 48,
      gridBuild: [
        [1, 1],
        [1, 1],
        [1, 1]
      ],
      orders: {
        type: 'auto-load'
      }
    },
    'power-plant': {
      name: 'power-plant',
      label: 'Power Plant',
      cost: 300,
      powerOut: 100,
      powerIn: 0,
      sight: 2,
      hasBib: true,
      hitPoints: 400,
      armor: 1,
      dependency: ['construction-yard'],
      owner: 'both',
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'damaged',
        count: 4
      }, {
        name: 'healthy',
        count: 4
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      gridShape: [
        [1, 0],
        [1, 1]
      ],
      pixelWidth: 48,
      pixelHeight: 48,
      gridBuild: [
        [1, 0],
        [1, 1],
        [1, 1]
      ]
    },
    'advanced-power-plant': {
      name: 'advanced-power-plant',
      label: 'Advanced Power Plant',
      cost: 700,
      powerOut: 200,
      powerIn: 0,
      sight: 2,
      hasBib: true,
      hitPoints: 600,
      armor: 1,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant'],
      owner: 'both',
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'damaged',
        count: 4
      }, {
        name: 'healthy',
        count: 4
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      gridShape: [
        [1, 0],
        [1, 1]
      ],
      pixelWidth: 48,
      pixelHeight: 48,
      gridBuild: [
        [1, 0],
        [1, 1],
        [1, 1]
      ]
    },
    'construction-yard': {
      name: 'construction-yard',
      label: 'Construction Yard',
      powerIn: 15,
      powerOut: 30,
      cost: 5e3,
      sight: 3,
      hitPoints: 800,
      dependency: undefined,
      hasBib: true,
      armor: 1,
      owner: 'both',
      spriteImages: [{
        name: 'build',
        count: 32
      }, {
        name: 'damaged',
        count: 4
      }, {
        name: 'damaged-construct',
        count: 20
      }, {
        name: 'healthy',
        count: 4
      }, {
        name: 'healthy-construct',
        count: 20
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      gridShape: [
        [1, 1, 1],
        [1, 1, 1]
      ],
      pixelWidth: 72,
      pixelHeight: 48,
      gridBuild: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    barracks: {
      name: 'barracks',
      label: 'Barracks',
      powerIn: 20,
      cost: 300,
      sight: 3,
      hasBib: true,
      hitPoints: 800,
      armor: 1,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant'],
      owner: 'gdi',
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'damaged',
        count: 10
      }, {
        name: 'healthy',
        count: 10
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [1, 1],
        [0, 0]
      ],
      gridBuild: [
        [1, 1],
        [1, 1],
        [1, 1]
      ]
    },
    'repair-facility': {
      name: 'repair-facility',
      label: 'Repair Facility',
      powerIn: 30,
      cost: 1200,
      sight: 3,
      hasBib: true,
      z: -1,
      armor: 1,
      tiberiumStorage: 1500,
      orders: {
        type: 'auto-repair'
      },
      hitPoints: 800,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant'],
      owner: 'both',
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'repair-healthy',
        count: 7
      }, {
        name: 'repair-damaged',
        count: 7
      }, {
        name: 'healthy',
        count: 1,
        spriteCount: 20
      }, {
        name: 'damaged',
        count: 1,
        spriteCount: 27
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 72,
      pixelHeight: 72,
      gridShape: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      gridBuild: [
        [0, 1, 0],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    'communications-center': {
      name: 'communications-center',
      label: 'Communications Center',
      powerIn: 40,
      cost: 1e3,
      sight: 3,
      hasBib: true,
      hitPoints: 1e3,
      armor: 1,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant', 'refinery'],
      owner: 'both',
      spriteImages: [{
        name: 'healthy',
        count: 16
      }, {
        name: 'damaged',
        count: 16
      }, {
        name: 'ultra-damaged',
        count: 1
      }, {
        name: 'build',
        count: 20
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [1, 1],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1],
        [1, 1]
      ]
    },
    'advanced-communications-tower': {
      name: 'advanced-communications-tower',
      label: 'Advanced Communications Tower',
      powerIn: 200,
      cost: 2800,
      sight: 10,
      hasBib: true,
      hitPoints: 1e3,
      armor: 1,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant', 'refinery', 'communications-center'],
      owner: 'gdi',
      spriteImages: [{
        name: 'healthy',
        count: 16
      }, {
        name: 'damaged',
        count: 16
      }, {
        name: 'ultra-damaged',
        count: 1
      }, {
        name: 'build',
        count: 20
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [1, 1],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1],
        [1, 1]
      ]
    },
    'temple-of-nod': {
      name: 'temple-of-nod',
      label: 'Temple of Nod',
      powerIn: 200,
      cost: 2800,
      sight: 10,
      hasBib: true,
      hitPoints: 1e3,
      armor: 2,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant', 'refinery', 'communications-center'],
      owner: 'nod',
      spriteImages: [{
        name: 'healthy-launch',
        count: 5
      }, {
        name: 'damaged-launch',
        count: 5
      }, {
        name: 'ultra-damaged',
        count: 1
      }, {
        name: 'build',
        count: 36
      }, {
        name: 'healthy',
        count: 1,
        spriteCount: 0
      }, {
        name: 'damaged',
        count: 1,
        spriteCount: 5
      }],
      pixelWidth: 72,
      pixelHeight: 72,
      gridShape: [
        [0, 0, 0],
        [1, 1, 1],
        [1, 1, 1]
      ],
      gridBuild: [
        [0, 0, 0],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    'tiberium-silo': {
      name: 'tiberium-silo',
      label: 'Tiberium Silo',
      powerIn: 10,
      cost: 150,
      sight: 2,
      hasBib: true,
      tiberiumStorage: 1500,
      armor: 1,
      hitPoints: 150,
      dependency: ['construction-yard', 'refinery'],
      owner: 'both',
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'damaged',
        count: 5
      }, {
        name: 'healthy',
        count: 5
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 24,
      gridShape: [
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    refinery: {
      name: 'refinery',
      label: 'Tiberium Refinery',
      powerIn: 40,
      powerOut: 10,
      cost: 2e3,
      sight: 3,
      hasBib: true,
      tiberiumStorage: 1e3,
      armor: 1,
      hitPoints: 800,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant'],
      owner: 'both',
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'damaged',
        count: 12
      }, {
        name: 'damaged-docking',
        count: 7
      }, {
        name: 'damaged-loading',
        count: 5
      }, {
        name: 'damaged-undocking',
        count: 6
      }, {
        name: 'healthy',
        count: 12
      }, {
        name: 'healthy-docking',
        count: 7
      }, {
        name: 'healthy-loading',
        count: 5
      }, {
        name: 'healthy-undocking',
        count: 6
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 72,
      pixelHeight: 72,
      z: -0.5,
      gridShape: [
        [0, 1, 0],
        [1, 1, 1]
      ],
      gridBuild: [
        [0, 1, 0],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    'hand-of-nod': {
      name: 'hand-of-nod',
      label: 'Hand of Nod',
      powerIn: 20,
      cost: 300,
      sight: 3,
      hasBib: true,
      hitPoints: 800,
      armor: 1,
      dependency: ['construction-yard', 'power-plant|advanced-power-plant'],
      owner: 'nod',
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'healthy',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 72,
      gridShape: [
        [0, 0],
        [1, 1],
        [0, 1]
      ],
      gridBuild: [
        [0, 0],
        [1, 1],
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-01': {
      name: 'civilian-building-01',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 5,
      cost: 0,
      sight: 1,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-02': {
      name: 'civilian-building-02',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 5,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-03': {
      name: 'civilian-building-03',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 5,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 1],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-04': {
      name: 'civilian-building-04',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 5,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-05': {
      name: 'civilian-building-05',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 5,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 24,
      gridShape: [
        [1, 1]
      ],
      gridBuild: [
        [1, 1]
      ]
    },
    'civilian-building-06': {
      name: 'civilian-building-06',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 24,
      gridShape: [
        [1, 1]
      ],
      gridBuild: [
        [1, 1]
      ]
    },
    'civilian-building-07': {
      name: 'civilian-building-07',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 24,
      gridShape: [
        [1, 1]
      ],
      gridBuild: [
        [1, 1]
      ]
    },
    'civilian-building-08': {
      name: 'civilian-building-08',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 24,
      pixelHeight: 24,
      gridShape: [
        [1]
      ],
      gridBuild: [
        [1]
      ]
    },
    'civilian-building-09': {
      name: 'civilian-building-09',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 24,
      pixelHeight: 24,
      gridShape: [
        [1]
      ],
      gridBuild: [
        [1]
      ]
    },
    'civilian-building-10': {
      name: 'civilian-building-10',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 24,
      pixelHeight: 24,
      gridShape: [
        [1]
      ],
      gridBuild: [
        [1]
      ]
    },
    'civilian-building-11': {
      name: 'civilian-building-11',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 24,
      pixelHeight: 24,
      gridShape: [
        [1]
      ],
      gridBuild: [
        [1]
      ]
    },
    'civilian-building-20': {
      name: 'civilian-building-20',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 3
      }, {
        name: 'damaged',
        count: 3
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-21': {
      name: 'civilian-building-21',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 3
      }, {
        name: 'damaged',
        count: 3
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-22': {
      name: 'civilian-building-22',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 3
      }, {
        name: 'damaged',
        count: 3
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-23': {
      name: 'civilian-building-23',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-24': {
      name: 'civilian-building-24',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-25': {
      name: 'civilian-building-25',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 5,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-26': {
      name: 'civilian-building-26',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 1
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 24,
      gridShape: [
        [1, 1]
      ],
      gridBuild: [
        [1, 1]
      ]
    },
    'civilian-building-27': {
      name: 'civilian-building-27',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 3
      }, {
        name: 'damaged',
        count: 3
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'civilian-building-30': {
      name: 'civilian-building-30',
      label: 'Civilian Building',
      powerIn: 0,
      powerOut: 20,
      cost: 0,
      sight: 2,
      hitPoints: 200,
      dependency: undefined,
      owner: 'none',
      action: 'stand',
      hasBib: false,
      spriteImages: [{
        name: 'healthy',
        count: 3
      }, {
        name: 'damaged',
        count: 3
      }, {
        name: 'ultra-damaged',
        count: 1
      }],
      pixelWidth: 48,
      pixelHeight: 48,
      gridShape: [
        [0, 0],
        [1, 1]
      ],
      gridBuild: [
        [1, 1],
        [1, 1]
      ]
    },
    'weapons-factory': {
      name: 'weapons-factory',
      label: 'Weapons Factory',
      powerIn: 30,
      powerOut: 0,
      cost: 2e3,
      sight: 3,
      owner: 'gdi',
      dependency: ['construction-yard', 'power-plant|advanced-power-plant', 'refinery'],
      armor: 2,
      hitPoints: 200,
      hasBib: true,
      spriteImages: [{
        name: 'build',
        count: 20
      }, {
        name: 'damaged',
        count: 1
      }, {
        name: 'damaged-base',
        count: 1
      }, {
        name: 'damaged-construct',
        count: 9
      }, {
        name: 'healthy',
        count: 1
      }, {
        name: 'healthy-base',
        count: 1
      }, {
        name: 'healthy-construct',
        count: 9
      }, {
        name: 'ultra-damaged',
        count: 0
      }, {
        name: 'ultra-damaged-base',
        count: 1
      }],
      pixelWidth: 72,
      pixelHeight: 72,
      gridShape: [
        [1, 1, 1],
        [1, 1, 1]
      ],
      gridBuild: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ]
    },
    airstrip: {
      name: 'airstrip',
      label: 'Air Strip',
      powerIn: 30,
      powerOut: 0,
      cost: 2e3,
      sight: 5,
      owner: 'nod',
      dependency: ['construction-yard', 'power-plant|advanced-power-plant', 'refinery'],
      armor: 3,
      hitPoints: 500,
      hasBib: true,
      spriteImages: [{
        name: 'healthy',
        count: 16
      }, {
        name: 'damaged',
        count: 16
      }, {
        name: 'ultra-damaged',
        count: 1
      }, {
        name: 'build',
        count: 14
      }],
      pixelWidth: 96,
      pixelHeight: 48,
      gridShape: [
        [1, 1, 1, 1],
        [1, 1, 1, 1]
      ],
      gridBuild: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1]
      ]
    }
  },
  defaults: {
    action: 'stand',
    type: 'buildings',
    armor: 1,
    z: 0,
    powerOut: 0,
    powerIn: 0,
    orders: {
      type: 'stand'
    },
    animationIndex: 0,
    selected: false,
    processOrders: function () {
      if (this.timeBomb) {
        this.timeBomb--
        if (this.timeBomb == 0) {
          this.life = 0
        }
      }
      this.lifeCode = getLifeCode(this)
      if (this.lifeCode == 'dead') {
        if (!this.exploding) {
          this.exploding = true
          var removeItem = this
          game.remove(removeItem)
          game.add({
            type: 'effects',
            name: 'fball1',
            x: this.cgX,
            y: this.cgY,
            background: this
          })
          sounds.play('crumble')
          if (this.attackedBy) {
            game.kills[this.attackedBy]++
            game.deaths[this.player]++
          }
        }
        return
      }
      if (this.action == 'build' || this.action == 'sell') {
        return
      }
      switch (this.orders.type) {
        case 'auto-load':
          if (this.action == 'build' || this.action == 'sell') {
            return
          }
          if (!this.docked || this.lifeCode == 'ultra-damaged') {
            this.action = 'stand'
          } else if (this.docked && this.docked.ammunition == this.docked.maxAmmunition) {
            this.action = 'stand'
          } else if (this.docked && this.action != 'reload-ammo' && this.action != 'build' && this.action != 'sell' && this.docked.z == 0) {
            this.action = 'reload-ammo'
            this.animationIndex = 0
          }
          break
        case 'auto-repair':
          if (this.lifeCode == 'ultra-damaged' || this.lifeCode == 'dead') {
            return
          }
          this.orders.repairTargets = []
          for (var i = game.vehicles.length - 1; i >= 0; i--) {
            var vehicle = game.vehicles[i]
            if (vehicle.team == this.team && vehicle.player == this.player && vehicle.life < vehicle.hitPoints && vehicle.lifeCode !== 'dead' && vehicle.x >= this.x + 0.5 && vehicle.y >= this.y + 0.5 && vehicle.x <= this.x + 2.5 && vehicle.y <= this.y + 2.5) {
              this.orders.repairTargets.push(vehicle)
            }
          }
          if (this.orders.repairTargets.length > 0) {
            this.action = 'repair-vehicle'
            for (var i = this.orders.repairTargets.length - 1; i >= 0; i--) {
              var item = this.orders.repairTargets[i]
              var cashSpent = 0.5
              if (game.cash[this.player] > cashSpent) {
                game.cash[this.player] -= cashSpent
                item.life += cashSpent * 2 * item.hitPoints / item.cost
                if (item.life > item.hitPoints) {
                  item.life = item.hitPoints
                }
              }
            }
          } else {
            this.action = 'stand'
          }
          break
        case 'sell':
          if (this.animationIndex === 0) {
            sounds.play('sell')
          }
          this.repairing = false
          this.action = 'sell'
          break
        case 'repair':
          this.orders = {
            type: 'stand'
          }
          this.repairing = true
          sounds.play('button')
          break
        case 'stop-repair':
          this.orders = {
            type: 'stand'
          }
          this.repairing = false
          sounds.play('button')
          break
        case 'harvest':
          if (this.action == 'stand') {
            this.animationIndex = 0
            this.action = 'docking'
          }
          break
      }
    },
    drawSelection: function () {
      var x = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft
      var y = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop
      game.foregroundContext.drawImage(this.selectImage, x, y)
      var selectBarHeight = 4
      game.foregroundContext.beginPath()
      game.foregroundContext.rect(x, y - selectBarHeight - 3, this.pixelWidth * this.life / this.hitPoints, selectBarHeight)
      if (this.lifeCode == 'healthy') {
        game.foregroundContext.fillStyle = 'lightgreen'
      } else if (this.lifeCode == 'damaged') {
        game.foregroundContext.fillStyle = 'yellow'
      } else {
        game.foregroundContext.fillStyle = 'red'
      }
      game.foregroundContext.fill()
      game.foregroundContext.beginPath()
      game.foregroundContext.strokeStyle = 'black'
      game.foregroundContext.rect(x, y - selectBarHeight - 3, this.pixelWidth, selectBarHeight)
      game.foregroundContext.stroke()
    },
    draw: function () {
      var x = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft
      var y = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop
      if (x < -this.pixelWidth || y < -this.pixelHeight - (this.hasBib ? 24 : 0) || x > game.viewportWidth || y > game.viewportHeight) {
        return
      }
      if (this.hasBib) {
        game.foregroundContext.drawImage(this.bibSpriteSheet, this.bibOffsetX, this.bibOffsetY, this.pixelWidth, 48, x, y + this.pixelHeight - 24, this.pixelWidth, 48)
      }
      if (this.baseImage && this.action != 'build' && this.action != 'sell') {
        game.foregroundContext.drawImage(this.spriteCanvas, this.baseImage.offset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight)
      }
      game.foregroundContext.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight)
      if (this.selected) {
        this.drawSelection()
      }
      if (this.repairing) {
        game.foregroundContext.globalAlpha = sidebar.textBrightness
        game.foregroundContext.drawImage(sidebar.repairImageBig, x + (this.pixelWidth - sidebar.repairImageBig.width) / 2, y + (this.pixelHeight - sidebar.repairImageBig.height) / 2)
        game.foregroundContext.globalAlpha = 1
      }
    },
    releaseHarvester: function () {
      this.action = 'stand'
      this.animationIndex = 0
      this.orders.harvester.orders.type = 'harvest'
      this.orders.harvester.player = this.player
      this.orders.harvester.team = this.team
      this.orders.harvester.percentLife = this.orders.harvester.life / this.orders.harvester.hitPoints
      game.add(this.orders.harvester)
      if (this.nextHarvester) {
        this.nextHarvester = undefined
      }
      this.orders = {
        type: 'stand'
      }
    },
    animate: function () {
      if (this.lifeCode == 'dead') {
        this.imageList = this.spriteArray['ultra-damaged']
        this.imageOffset = this.imageList.offset
        return
      }
      this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight
      if (this.nextHarvester && this.orders.harvester != this.nextHarvester && this.nextHarvester.lifeCode == 'dead') {
        this.nextHarvester = undefined
      }
      this.baseImage = this.spriteArray[this.lifeCode + '-base']
      switch (this.action) {
        case 'stand':
          if (this.name == 'tiberium-silo') {
            this.imageList = this.spriteArray[this.lifeCode]
            this.imageOffset = this.imageList.offset + 0
          } else {
            this.imageList = this.spriteArray[this.lifeCode]
            this.imageOffset = this.imageList.offset + this.animationIndex
            this.animationIndex++
            if (this.animationIndex >= this.imageList.count) {
              this.animationIndex = 0
            }
          }
          break
        case 'repair-vehicle':
          this.imageList = this.spriteArray['repair-' + this.lifeCode]
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
          }
          break
        case 'reload-ammo':
          this.imageList = this.spriteArray[this.lifeCode + '-reload-ammo']
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            this.docked.ammunition++
            if (this.docked.ammunition == this.docked.maxAmmunition) {
              this.action = 'stand'
            }
          }
          break
        case 'build':
          this.imageList = this.spriteArray['build']
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            this.action = 'stand'
            if (this.name == 'refinery') {
              game.add({
                name: 'harvester',
                orders: {
                  type: 'harvest'
                },
                type: 'vehicles',
                team: this.team,
                player: this.player,
                direction: 14,
                x: this.x + 0.5,
                y: this.y + 2.5
              })
            } else if (this.name == 'helipad') {
              var unitName = this.team == 'gdi' ? 'orca' : 'apache'
              this.docked = game.add({
                name: unitName,
                type: 'aircraft',
                player: this.player,
                team: this.team,
                x: this.x + 1,
                y: this.y + 1,
                direction: 24,
                helipad: this,
                orders: {
                  type: 'dock'
                }
              })
            }
          }
          break
        case 'docking':
          if (this.lifeCode == 'ultra-damaged' || this.lifeCode == 'dead') {
            this.releaseHarvester()
            break
          }
          this.imageList = this.spriteArray[this.lifeCode + '-docking']
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            this.action = 'loading'
          }
          break
        case 'loading':
          if (this.lifeCode == 'ultra-damaged') {
            this.releaseHarvester()
            break
          }
          this.imageList = this.spriteArray[this.lifeCode + '-loading']
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            this.orders.harvester.tiberium--
            game.cash[this.player] += 50
            if (this.orders.harvester.tiberium <= 0) {
              this.action = 'undocking'
            }
          }
          break
        case 'undocking':
          if (this.lifeCode == 'ultra-damaged') {
            this.releaseHarvester()
            break
          }
          this.imageList = this.spriteArray[this.lifeCode + '-undocking']
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.releaseHarvester()
          }
          break
        case 'construct':
          this.imageList = this.spriteArray[this.lifeCode + '-construct']
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            this.action = 'stand'
          }
          break
        case 'launch':
          this.imageList = this.spriteArray[this.lifeCode + '-launch']
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            this.action = 'stand'
          }
          break
        case 'sell':
          this.imageList = this.spriteArray['build']
          this.imageOffset = this.imageList.offset + (this.imageList.count - this.animationIndex - 1)
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            game.remove(this)
            game.cash[this.player] += this.cost / 2
            this.action = 'stand'
          }
          break
      }
      if (this.repairing) {
        if (this.life >= this.hitPoints) {
          this.repairing = false
          this.life = this.hitPoints
        } else {
          var cashSpent = 0.5
          if (game.cash[this.player] > cashSpent) {
            game.cash[this.player] -= cashSpent
            this.life += cashSpent * 2 * this.hitPoints / this.cost
          }
        }
      }
    }
  },
  add: function (details) {
    var item = {}
    var name = details.name
    $.extend(item, this.defaults)
    $.extend(item, this.list[name])
    if (details.percentLife) {
      item.life = item.hitPoints * details.percentLife
      delete item.percentLife
    } else {
      item.life = item.hitPoints
    }
    $.extend(item, details)
    item.cgX = item.x + item.pixelWidth / 2 / game.gridSize
    item.cgY = item.y + item.gridShape.length / 2
    item.softCollisionRadius = item.pixelWidth / 2
    item.hardCollisionRadius = item.pixelWidth / 4
    return item
  },
  load: function (name) {
    var item = this.list[name]
    console.log('Loading', name, '...')
    item.type = this.type
    item.spriteCanvas = document.createElement('canvas')
    item.spriteSheet = loader.loadImage('images/' + this.type + '/' + name + '-sprite-sheet.png', function (image) {
      createSpriteSheetCanvas(image, item.spriteCanvas, 'colormap')
    })
    item.selectImage = loader.loadImage('images/' + 'sidebar/select-' + item.pixelWidth / game.gridSize + '-' + item.pixelHeight / game.gridSize + '.png')
    item.spriteArray = []
    item.spriteCount = 0
    item.bibSpriteSheet = loader.loadImage('images/' + this.type + '/bib-sprite-sheet.png')
    item.bibOffsetX = item.pixelWidth == 72 ? 48 : item.pixelWidth == 96 ? 119 : 0
    item.bibOffsetY = maps.currentMapData.theater == 'desert' ? 48 : 0
    item.gridWidth = item.gridShape[0].length
    item.gridHeight = item.gridShape.length
    for (var i = 0; i < item.spriteImages.length; i++) {
      var constructImageCount = item.spriteImages[i].count
      var constructImageName = item.spriteImages[i].name
      if (typeof item.spriteImages[i].spriteCount !== 'undefined') {
        item.spriteCount = item.spriteImages[i].spriteCount
      }
      if (item.spriteImages[i].direction) {
        for (var j = 0; j < item.directions; j++) {
          item.spriteArray[constructImageName + '-' + j] = {
            name: constructImageName + '-' + j,
            count: constructImageCount,
            offset: item.spriteCount
          }
          item.spriteCount += constructImageCount
        }
      } else {
        item.spriteArray[constructImageName] = {
          name: constructImageName,
          count: constructImageCount,
          offset: item.spriteCount
        }
        item.spriteCount += constructImageCount
      }
    }
  }
}
!(function () {
  var lastTime = 0
  var vendors = ['ms', ';', 'webkit', 'o']
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback, element) {
      var currTime = (new Date()).getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}())
if (!Array.prototype.remove) {
  Array.prototype.remove = function (e) {
    var t, _ref
    if ((t = this.indexOf(e)) > -1) {
      return [].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref
    }
  }
}
var loader = {
  loaded: true,
  loadedCount: 0,
  totalCount: 0,
  init: function () {
    var mp3Support, oggSupport
    var audio = document.createElement('audio')
    if (audio.canPlayType) {
      mp3Support = audio.canPlayType('audio/mpeg') !== ''
      oggSupport = audio.canPlayType('audio/ogg; codecs="vorbis"') !== ''
    } else {
      mp3Support = false
      oggSupport = false
    }
    loader.soundFileExtn = oggSupport ? '.ogg' : mp3Support ? '.mp3' : undefined
    var webMSupport, h264Support
    var video = document.createElement('video')
    if (video.canPlayType) {
      h264Support = (video.canPlayType('video/mp4; codecs="avc1.42E01E"') || video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) !== ''
      webMSupport = video.canPlayType('video/webm; codecs="vp8, vorbis"') !== ''
    } else {
      h264Support = false
      webMSupport = false
    }
    loader.videoFileExtn = webMSupport ? '.webm' : h264Support ? '.mp4' : undefined
  },
  loadImage: function (url, callback) {
    this.totalCount++
    loader.updateStatus()
    this.loaded = false
    $('#loadingscreen').show()
    var image = new Image()
    image.src = url
    image.onload = function (ev) {
      loader.itemLoaded(ev)
      if (callback) {
        callback(image)
      }
    }
    return image
  },
  soundFileExtn: '.ogg',
  loadSound: function (url) {
    var audio = new Audio()
    if (!loader.soundFileExtn) {
      return audio
    }
    this.totalCount++
    loader.updateStatus()
    this.loaded = false
    $('#loadingscreen').show()
    audio.addEventListener('canplaythrough', loader.itemLoaded, false)
    audio.preload = 'auto'
    audio.src = url + loader.soundFileExtn
    audio.load()
    return audio
  },
  loadVideo: function (url) {
    var videoObject = document.createElement('video')
    if (!loader.videoFileExtn) {
      return videoObject
    }
    this.totalCount++
    loader.updateStatus()
    this.loaded = false
    $('#loadingscreen').show()
    videoObject.addEventListener('canplaythrough', loader.itemLoaded, false)
    videoObject.preload = 'auto'
    videoObject.src = url + loader.videoFileExtn
    videoObject.load()
    return videoObject
  },
  itemLoaded: function (e) {
    e.target.removeEventListener('canplaythrough', loader.itemLoaded, false)
    e.target.removeEventListener('canplay', loader.itemLoaded, false)
    e.target.removeEventListener('loadeddata', loader.itemLoaded, false)
    loader.loadedCount++
    loader.updateStatus()
    if (loader.loadedCount === loader.totalCount || loader.loadedCount === 167) {
      loader.loaded = true
      loader.loadedCount = 0
      loader.totalCount = 0
      $('#loadingscreen').hide()
      if (loader.onload) {
        loader.onload()
        loader.onload = undefined
      }
    }
  },
  updateStatus: function () {
    $('#loadingmessage').html('Loading ' + loader.loadedCount + ' of ' + loader.totalCount + '...')
    var progress = loader.totalCount ? Math.round(100 * loader.loadedCount / loader.totalCount) : 100
    $('#progressbar')[0].value = progress
  }
}
var colors = [
  [0, 0, 0],
  [193, 0, 173],
  [0, 175, 171],
  [0, 182, 0],
  [16, 16, 16],
  [252, 255, 50],
  [255, 49, 77],
  [186, 79, 0],
  [191, 0, 0],
  [0, 255, 255],
  [93, 0, 255],
  [30, 0, 175],
  [0, 0, 0],
  [85, 85, 85],
  [170, 170, 170],
  [255, 255, 255],
  [255, 216, 133],
  [255, 207, 143],
  [255, 208, 134],
  [255, 207, 129],
  [255, 208, 115],
  [255, 191, 108],
  [255, 192, 83],
  [252, 174, 75],
  [252, 175, 51],
  [247, 148, 10],
  [232, 117, 0],
  [217, 90, 0],
  [201, 60, 0],
  [183, 40, 0],
  [171, 12, 0],
  [153, 0, 0],
  [0, 200, 225],
  [55, 164, 205],
  [75, 139, 185],
  [87, 112, 168],
  [75, 139, 185],
  [55, 164, 205],
  [30, 182, 225],
  [255, 255, 255],
  [255, 255, 255],
  [0, 189, 0],
  [127, 0, 0],
  [127, 0, 0],
  [109, 0, 0],
  [100, 0, 0],
  [109, 0, 0],
  [19, 0, 0],
  [17, 12, 12],
  [10, 17, 12],
  [17, 11, 20],
  [11, 16, 20],
  [20, 20, 24],
  [33, 28, 28],
  [21, 33, 28],
  [32, 32, 28],
  [23, 28, 32],
  [27, 32, 36],
  [36, 36, 40],
  [50, 39, 40],
  [37, 49, 44],
  [53, 48, 44],
  [40, 39, 48],
  [41, 52, 52],
  [51, 57, 52],
  [71, 55, 56],
  [24, 71, 38],
  [47, 66, 38],
  [35, 66, 56],
  [51, 70, 55],
  [45, 83, 59],
  [68, 69, 59],
  [106, 80, 53],
  [56, 55, 69],
  [52, 69, 68],
  [49, 63, 111],
  [67, 73, 68],
  [88, 71, 72],
  [67, 87, 71],
  [83, 91, 71],
  [104, 89, 84],
  [79, 104, 74],
  [59, 104, 84],
  [84, 103, 84],
  [100, 103, 74],
  [121, 102, 74],
  [99, 107, 88],
  [120, 106, 88],
  [95, 120, 87],
  [116, 119, 91],
  [77, 120, 96],
  [78, 119, 117],
  [99, 124, 100],
  [122, 117, 117],
  [147, 86, 78],
  [143, 113, 86],
  [141, 121, 108],
  [99, 137, 90],
  [111, 137, 99],
  [110, 153, 115],
  [131, 140, 103],
  [152, 139, 102],
  [148, 152, 101],
  [131, 139, 116],
  [147, 156, 114],
  [175, 150, 114],
  [137, 170, 114],
  [169, 174, 117],
  [85, 117, 168],
  [143, 114, 172],
  [70, 134, 146],
  [114, 143, 137],
  [4, 4, 8],
  [20, 19, 28],
  [34, 44, 53],
  [50, 73, 76],
  [61, 89, 98],
  [77, 110, 118],
  [91, 130, 138],
  [106, 150, 158],
  [61, 31, 18],
  [98, 40, 24],
  [134, 39, 31],
  [170, 28, 28],
  [194, 27, 9],
  [221, 0, 0],
  [249, 0, 0],
  [255, 0, 0],
  [141, 141, 65],
  [159, 166, 86],
  [179, 191, 115],
  [198, 215, 144],
  [181, 167, 130],
  [149, 129, 116],
  [121, 100, 101],
  [0, 116, 114],
  [0, 95, 102],
  [0, 77, 94],
  [0, 59, 81],
  [0, 51, 73],
  [24, 72, 34],
  [24, 90, 41],
  [35, 106, 53],
  [42, 127, 64],
  [116, 99, 42],
  [150, 123, 57],
  [190, 147, 71],
  [229, 171, 92],
  [255, 154, 31],
  [255, 215, 40],
  [112, 75, 53],
  [137, 92, 69],
  [175, 120, 85],
  [33, 29, 53],
  [64, 64, 64],
  [165, 146, 123],
  [184, 206, 0],
  [170, 185, 0],
  [202, 219, 0],
  [0, 162, 45],
  [0, 107, 18],
  [205, 255, 255],
  [144, 208, 211],
  [213, 199, 172],
  [220, 211, 193],
  [195, 254, 0],
  [127, 238, 0],
  [109, 213, 0],
  [202, 202, 202],
  [72, 72, 72],
  [179, 177, 233],
  [159, 128, 0],
  [143, 112, 0],
  [119, 87, 0],
  [79, 33, 21],
  [145, 0, 0],
  [253, 218, 110],
  [229, 194, 95],
  [204, 173, 84],
  [184, 152, 71],
  [142, 115, 48],
  [102, 77, 30],
  [59, 45, 17],
  [17, 12, 3],
  [198, 178, 88],
  [173, 157, 77],
  [146, 141, 69],
  [126, 120, 58],
  [110, 104, 51],
  [89, 88, 40],
  [72, 70, 33],
  [57, 53, 26],
  [218, 218, 218],
  [190, 190, 190],
  [161, 161, 161],
  [133, 133, 133],
  [109, 109, 109],
  [80, 80, 80],
  [52, 52, 52],
  [24, 24, 24],
  [222, 221, 230],
  [195, 192, 211],
  [166, 162, 191],
  [134, 130, 158],
  [102, 98, 126],
  [73, 70, 94],
  [45, 42, 61],
  [20, 19, 28],
  [255, 199, 111],
  [182, 111, 70],
  [136, 173, 200],
  [95, 87, 139],
  [95, 62, 102],
  [149, 72, 97],
  [124, 47, 72],
  [150, 144, 79],
  [126, 120, 53],
  [255, 138, 146],
  [255, 118, 126],
  [0, 112, 152],
  [0, 83, 123],
  [0, 158, 146],
  [0, 129, 118],
  [0, 101, 89],
  [118, 134, 176],
  [90, 146, 201],
  [137, 137, 133],
  [149, 150, 132],
  [169, 149, 140],
  [173, 177, 139],
  [139, 132, 184],
  [154, 131, 184],
  [155, 145, 188],
  [170, 146, 171],
  [169, 148, 188],
  [201, 184, 137],
  [170, 147, 196],
  [180, 171, 204],
  [208, 178, 203],
  [234, 216, 231],
  [29, 25, 6],
  [37, 33, 10],
  [41, 37, 14],
  [47, 50, 17],
  [55, 58, 25],
  [63, 66, 29],
  [71, 74, 37],
  [79, 82, 45],
  [88, 91, 53],
  [91, 100, 61],
  [99, 108, 69],
  [107, 116, 83],
  [115, 124, 91],
  [123, 131, 103],
  [131, 139, 116],
  [255, 255, 255]
]
var palettes = {
  gdi: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191],
  nod: [127, 126, 125, 124, 122, 46, 120, 47, 125, 124, 123, 122, 42, 121, 120, 120],
  yellow: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191],
  red: [127, 126, 125, 124, 122, 46, 120, 47, 125, 124, 123, 122, 42, 121, 120, 120],
  teal: [2, 119, 118, 135, 136, 138, 112, 12, 118, 135, 136, 137, 138, 139, 114, 112],
  orange: [24, 25, 26, 27, 29, 31, 46, 47, 26, 27, 28, 29, 30, 31, 43, 47],
  green: [5, 165, 166, 167, 159, 142, 140, 199, 166, 167, 157, 3, 159, 143, 142, 141],
  gray: [161, 200, 201, 202, 204, 205, 206, 12, 201, 202, 203, 204, 205, 115, 198, 114],
  neutral: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191],
  darkgray: [14, 195, 196, 13, 169, 198, 199, 112, 14, 195, 196, 13, 169, 198, 199, 112],
  brown: [146, 152, 209, 151, 173, 150, 173, 183, 146, 152, 209, 151, 173, 150, 173, 183]
}

function createSpriteSheetCanvas (image, canvas, type) {
  var colorCount = 2
  if (game.type == 'multiplayer') {
    colorCount = multiplayer.players.length
  }
  canvas.width = image.width
  canvas.height = image.height * colorCount
  var context = canvas.getContext('2d')
  for (var i = 0; i < colorCount; i++) {
    context.drawImage(image, 0, image.height * i)
  }
  var imgData = context.getImageData(0, 0, canvas.width, canvas.height)
  var imgDataArray = imgData.data
  var size = imgDataArray.length / 4
  var rThreshold = 25
  var gThreshold = 25
  var bThreshold = 25
  var paletteOriginal = palettes['yellow']
  if (game.type == 'singleplayer') {
    var paletteFinal
    if (type == 'colormap') {
      paletteFinal = palettes['red']
    } else {
      paletteFinal = palettes['gray']
    }
    for (var p = size / 2; p < size; p++) {
      var r = imgDataArray[p * 4]
      var g = imgDataArray[p * 4 + 1]
      var b = imgDataArray[p * 4 + 2]
      var a = imgDataArray[p * 4 + 2]
      for (var i = 16 - 1; i >= 0; i--) {
        var colorOriginal = colors[paletteOriginal[i]]
        var colorFinal = colors[paletteFinal[i]]
        if (Math.abs(r - colorOriginal[0]) < rThreshold && Math.abs(g - colorOriginal[1]) < gThreshold && Math.abs(b - colorOriginal[2]) < bThreshold) {
          imgDataArray[p * 4 + 0] = colorFinal[0]
          imgDataArray[p * 4 + 1] = colorFinal[1]
          imgDataArray[p * 4 + 2] = colorFinal[2]
          break
        }
      }
    }
  } else {
    for (var j = 0; j < colorCount; j++) {
      var paletteFinal = palettes[multiplayer.players[j].color]
      for (var p = size * j / colorCount; p < size * (j + 1) / colorCount; p++) {
        var r = imgDataArray[p * 4]
        var g = imgDataArray[p * 4 + 1]
        var b = imgDataArray[p * 4 + 2]
        var a = imgDataArray[p * 4 + 2]
        for (var i = 16 - 1; i >= 0; i--) {
          var colorOriginal = colors[paletteOriginal[i]]
          var colorFinal = colors[paletteFinal[i]]
          if (Math.abs(r - colorOriginal[0]) < rThreshold && Math.abs(g - colorOriginal[1]) < gThreshold && Math.abs(b - colorOriginal[2]) < bThreshold) {
            imgDataArray[p * 4 + 0] = colorFinal[0]
            imgDataArray[p * 4 + 1] = colorFinal[1]
            imgDataArray[p * 4 + 2] = colorFinal[2]
            break
          }
        }
      }
    }
  }
  context.putImageData(imgData, 0, 0)
  return canvas
}

function getLifeCode (object) {
  var lifePercent = roundFloating(object.life / object.hitPoints)
  var lifeCode
  if (lifePercent > 0.5) {
    lifeCode = 'healthy'
  } else if (lifePercent > 0.25) {
    lifeCode = 'damaged'
  } else if (lifePercent > 0.05) {
    lifeCode = 'ultra-damaged'
  } else {
    lifeCode = 'dead'
  }
  return lifeCode
}

function roundFloating (number) {
  return Math.round(number * 1e4) / 1e4
}
var explosionSound = {
  frag1: 'xplobig4',
  frag3: 'xplobig6',
  vehhit1: 'xplos',
  vehhit2: 'xplos',
  vehhit3: 'xplos',
  atomsfx: 'nukexplo',
  fball1: 'xplos',
  'art-exp1': 'xplosml2',
  napalm1: 'flamer2',
  napalm2: 'flamer2',
  napalm3: 'flamer2'
}
var effects = {
  type: 'effects',
  list: {
    piff: {
      imageCount: 4,
      pixelWidth: 9,
      pixelHeight: 13
    },
    piffpiff: {
      imageCount: 7,
      pixelWidth: 15,
      pixelHeight: 15
    },
    vehhit1: {
      imageCount: 17,
      pixelWidth: 30,
      pixelHeight: 17
    },
    vehhit2: {
      imageCount: 22,
      pixelWidth: 21,
      pixelHeight: 17
    },
    vehhit3: {
      imageCount: 14,
      pixelWidth: 19,
      pixelHeight: 13
    },
    'art-exp1': {
      imageCount: 22,
      pixelWidth: 41,
      pixelHeight: 35
    },
    napalm1: {
      imageCount: 14,
      pixelWidth: 22,
      pixelHeight: 18
    },
    napalm2: {
      imageCount: 14,
      pixelWidth: 41,
      pixelHeight: 40
    },
    napalm3: {
      imageCount: 14,
      pixelWidth: 72,
      pixelHeight: 72
    },
    frag1: {
      imageCount: 14,
      pixelWidth: 45,
      pixelHeight: 33
    },
    frag3: {
      imageCount: 22,
      pixelWidth: 41,
      pixelHeight: 28
    },
    fball1: {
      imageCount: 18,
      pixelWidth: 67,
      pixelHeight: 44
    },
    smokey: {
      imageCount: 7,
      pixelWidth: 19,
      pixelHeight: 17
    },
    smoke: {
      imageCount: 91,
      pixelWidth: 23,
      pixelHeight: 23,
      animationIndex: 0,
      draw: function () {
        this.interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX
        this.interpolatedY = this.y + game.movementInterpolationFactor * this.lastMovementY
        var x = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft
        var y = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop
        if (x < -this.pixelWidth || y < -this.pixelHeight || x > game.viewportWidth || y > game.viewportHeight) {
          return
        }
        game.foregroundContext.drawImage(this.spriteSheet, this.animationIndex * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, x - this.pixelWidth / 2, y - this.pixelHeight + 3, this.pixelWidth, this.pixelHeight)
      }
    },
    'minigun-fire': {
      imageCount: 6,
      pixelWidth: 18,
      pixelHeight: 17,
      directions: 8
    },
    chem: {
      imageCount: 13,
      pixelWidth: 79,
      pixelHeight: 79,
      directions: 8
    },
    flame: {
      imageCount: 13,
      pixelWidth: 79,
      pixelHeight: 79,
      directions: 8
    },
    flare: {
      imageCount: 92,
      pixelWidth: 42,
      pixelHeight: 31,
      loop: 60
    },
    'sam-fire': {
      pixelWidth: 55,
      pixelHeight: 35,
      directions: 8,
      imageCount: 16,
      draw: function () {
        if (this.animationIndex < 0) {
          this.animationIndex = 0
        }
        var x = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft
        var y = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop
        if (x < -this.pixelWidth || y < -this.pixelHeight || x > game.viewportWidth || y > game.viewportHeight) {
          return
        }
        game.foregroundContext.drawImage(this.spriteSheet, (this.direction * this.imageCount + this.animationIndex) * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight)
      }
    },
    'laser-fire': {
      imageCount: 5,
      spriteSheet: true,
      draw: function () {
        var x = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft
        var y = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop
        var targetX = Math.round(this.targetX * game.gridSize) - game.viewportX + game.viewportLeft
        var targetY = Math.round(this.targetY * game.gridSize) - game.viewportY + game.viewportTop
        game.foregroundContext.beginPath()
        game.foregroundContext.moveTo(x, y)
        game.foregroundContext.lineTo(targetX, targetY)
        game.foregroundContext.strokeStyle = 'red'
        game.foregroundContext.stroke()
      }
    },
    atomsfx: {
      imageCount: 27,
      pixelWidth: 78,
      pixelHeight: 121
    },
    atomsmoke: {
      imageCount: 33,
      pixelWidth: 24,
      pixelHeight: 48
    },
    ioncannon: {
      imageCount: 15,
      pixelWidth: 72,
      pixelHeight: 191,
      draw: function () {
        if (this.animationIndex < 0) {
          this.animationIndex = 0
        }
        var x = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft
        var y = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop
        game.foregroundContext.drawImage(this.spriteSheet, (this.direction * this.imageCount + this.animationIndex) * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, x - this.pixelWidth / 2, y - this.pixelHeight + 12, this.pixelWidth, this.pixelHeight)
      }
    }
  },
  defaults: {
    animationIndex: -1,
    direction: 0,
    lastMovementY: 0,
    lastMovementX: 0,
    z: 0,
    animate: function () {
      this.animationIndex++
      if (this.animationIndex >= this.imageCount) {
        this.animationIndex = 0
        if (!this.loop) {
          game.remove(this)
          if (this.oncomplete) {
            this.oncomplete()
          }
        } else {
          this.animationIndex = this.loop
        }
      }
    },
    draw: function () {
      if (this.animationIndex < 0) {
        this.animationIndex = 0
      }
      var x = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft
      var y = Math.round((this.y - this.z) * game.gridSize) - game.viewportY + game.viewportTop
      if (x < -this.pixelWidth || y < -this.pixelHeight || x > game.viewportWidth + this.pixelWidth || y > game.viewportHeight + this.pixelHeight) {
        return
      }
      if (this.background && this.animationIndex <= this.imageCount / 3) {
        this.background.draw()
      }
      game.foregroundContext.drawImage(this.spriteSheet, (this.direction * this.imageCount + this.animationIndex) * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, x - this.pixelWidth / 2, y - this.pixelHeight / 2, this.pixelWidth, this.pixelHeight)
    }
  },
  add: function (details) {
    var item = {}
    var name = details.name
    $.extend(item, this.defaults)
    $.extend(item, this.list[name])
    $.extend(item, details)
    return item
  },
  load: function (name) {
    var item = this.list[name]
    if (item.spriteSheet) {
      return
    }
    item.name = name
    item.type = this.type
    item.spriteSheet = loader.loadImage('images/' + this.type + '/' + name + '-sprite-sheet.png')
  },
  loadAll: function () {
    var names = Object.keys(this.list).sort()
    for (var i = names.length - 1; i >= 0; i--) {
      this.load(names[i])
    }
  }
}
var fog = {
  fogGrid: [],
  canvas: document.createElement('canvas'),
  init: function () {
    this.context = this.canvas.getContext('2d')
    this.canvas.width = maps.currentMapData.width * game.gridSize
    this.canvas.height = maps.currentMapData.height * game.gridSize
    this.context.fillStyle = 'rgba(0,0,0,1)'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    var fogGrid = []
    for (var i = 0; i < maps.currentMapData.height; i++) {
      fogGrid[i] = []
      for (var j = 0; j < maps.currentMapData.width; j++) {
        fogGrid[i][j] = 1
      }
    }
    for (var l = game.players.length - 1; l >= 0; l--) {
      this.fogGrid[game.players[l]] = $.extend(true, [], fogGrid)
    }
  },
  isPointOverFog: function (x, y) {
    if (y < 0 || y / game.gridSize >= maps.currentMapData.height || x < 0 || x / game.gridSize >= maps.currentMapData.width) {
      return true
    }
    return this.fogGrid[game.player][Math.floor(y / game.gridSize)][Math.floor(x / game.gridSize)] == 1
  },
  animate: function () {
    fog.context.globalCompositeOperation = 'destination-out'
    for (var i = game.items.length - 1; i >= 0; i--) {
      var item = game.items[i]
      for (var l = game.players.length - 1; l >= 0; l--) {
        player = game.players[l]
        if (item.player == player || item.firing) {
          var x = Math.floor(item.cgX)
          var y = Math.floor(item.cgY)
          var x0, y0, x1, y1
          if (item.player === player) {
            x0 = x - item.sight < 0 ? 0 : x - item.sight
            y0 = y - item.sight < 0 ? 0 : y - item.sight
            x1 = x + item.sight > maps.currentMapData.width - 1 ? maps.currentMapData.width - 1 : x + item.sight
            y1 = y + item.sight > maps.currentMapData.height - 1 ? maps.currentMapData.height - 1 : y + item.sight
          } else {
            x0 = x - 1 < 0 ? 0 : x - 1
            y0 = y - 1 < 0 ? 0 : y - 1
            x1 = x + 1 > maps.currentMapData.width - 1 ? maps.currentMapData.width - 1 : x + 1
            y1 = y + 1 > maps.currentMapData.height - 1 ? maps.currentMapData.height - 1 : y + 1
          }
          for (var j = x0; j <= x1; j++) {
            for (var k = y0; k <= y1; k++) {
              if (j > x0 && j < x1 || k > y0 && k < y1) {
                if (game.player == player && this.fogGrid[player][k][j]) {
                  this.context.fillStyle = 'rgba(100,0,0,0.9)'
                  this.context.beginPath()
                  this.context.arc(j * game.gridSize + 12, k * game.gridSize + 12, 16, 0, 2 * Math.PI, false)
                  this.context.fill()
                  this.context.fillStyle = 'rgba(100,0,0,0.7)'
                  this.context.beginPath()
                  this.context.arc(j * game.gridSize + 12, k * game.gridSize + 12, 18, 0, 2 * Math.PI, false)
                  this.context.fill()
                  this.context.fillStyle = 'rgba(100,0,0,0.5)'
                  this.context.beginPath()
                  this.context.arc(j * game.gridSize + 12, k * game.gridSize + 12, 24, 0, 2 * Math.PI, false)
                  this.context.fill()
                }
                this.fogGrid[player][k][j] = 0
              }
            }
          }
        }
      }
    }
    fog.context.globalCompositeOperation = 'source-over'
  },
  draw: function () {
    game.foregroundContext.drawImage(this.canvas, game.viewportX, game.viewportY, game.viewportWidth, game.viewportHeight, game.viewportLeft, game.viewportTop, game.viewportWidth, game.viewportHeight)
  }
}
var game = {
  canvasWidth: 640,
  canvasHeight: 535,
  gridSize: 24,
  init: function () {
    $(window).resize(game.resize)
    game.resize()
    $('#fullscreenbutton').click(game.startFullScreen)
    $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', game.fullScreenChanged)
    loader.init()
    videos.init()
    menus.load()
    sounds.load()
    sidebar.load()
    mouse.load()
    bullets.loadAll()
    effects.loadAll()
    game.backgroundContext = $('.gamebackgroundcanvas')[0].getContext('2d')
    game.foregroundContext = $('.gameforegroundcanvas')[0].getContext('2d')
    if (loader.loaded) {
      menus.show('game-type')
    } else {
      loader.onload = function () {
        menus.show('game-type')
      }
    }
  },
  fullScreen: false,
  aspectRatio: 640 / 535,
  scaleFactor: 1,
  startFullScreen: function () {
    var gameinterfacescreen = $('.fullscreencontainer')[0]
    if (gameinterfacescreen.requestFullScreen) {
      gameinterfacescreen.requestFullScreen()
    } else if (gameinterfacescreen.mozRequestFullScreen) {
      gameinterfacescreen.mozRequestFullScreen()
    } else if (gameinterfacescreen.webkitRequestFullScreen) {
      gameinterfacescreen.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
    } else if (gameinterfacescreen.requestFullscreen) {
      gameinterfacescreen.requestFullscreen()
    }
  },
  fullScreenChanged: function () {
    game.fullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
    game.resize()
  },
  resize: function () {
    var $window = $(window)
    var windowWidth = $window.width()
    var windowHeight = $window.height()
    var maxPossibleHeight = windowHeight
    var maxPossibleWidth = windowWidth
    if (!game.fullScreen) {
      $('.gamecontainer').css('border', '')
      maxPossibleHeight = maxPossibleHeight - $('footer').height() - 10
      maxPossibleWidth = maxPossibleWidth - $('.leftpanel').width() - $('.rightpanel').width() - 10
    } else {
      $('.gamecontainer').css('border', 'none')
      maxPossibleHeight = maxPossibleHeight - 10
      maxPossibleWidth = maxPossibleWidth - 10
    }
    var newWidth, newHeight
    if (windowWidth >= 1100) {
      if (maxPossibleWidth / maxPossibleHeight > game.aspectRatio) {
        newWidth = Math.floor(maxPossibleHeight * game.aspectRatio)
        newHeight = maxPossibleHeight
      } else {
        newHeight = Math.floor(maxPossibleWidth / game.aspectRatio)
        newWidth = maxPossibleWidth
      }
      game.scaleFactor = 640 / newWidth
      $('.gamecontainer').width(newWidth).height(newHeight)
      $('.gamelayer').width(newWidth).height(newHeight)
      $('.middlepanel').width(newWidth)
      menus.reposition(newWidth, newHeight)
    }
  },
  viewportX: 0,
  viewportY: 0,
  viewportTop: 35,
  viewportLeft: 0,
  viewportHeight: 481,
  viewportAdjustX: 0,
  viewportAdjustY: 0,
  screenWidth: 640,
  screenHeight: 535,
  animationTimeout: 100,
  animationInterval: undefined,
  createGrids: function () {
    if (!game.terrainGrid) {
      game.buildingLandscapeChanged = true
      var terrainGrid = Array(maps.currentMapTerrain.length)
      for (var i = 0; i < maps.currentMapTerrain.length; i++) {
        terrainGrid[i] = Array(maps.currentMapTerrain[i].length)
        for (var j = 0; j < maps.currentMapTerrain[i].length; j++) {
          if (maps.currentMapTerrain[i][j]) {
            terrainGrid[i][j] = 1
          } else {
            terrainGrid[i][j] = 0
          }
        }
      }
      for (var i = game.trees.length - 1; i >= 0; i--) {
        var item = game.trees[i]
        if (!item.gridShape) {
          console.log(item.name)
        }
        for (var j = item.gridShape.length - 1; j >= 0; j--) {
          for (var k = item.gridShape[j].length - 1; k >= 0; k--) {
            if (item.gridShape[j][k] == 1) {
              try {
                terrainGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = 1
              } catch (e) {}
            }
          }
        }
      }
      game.terrainGrid = terrainGrid
    }
    if (game.buildingLandscapeChanged) {
      game.obstructionGrid = $.extend(true, [], game.terrainGrid)
      for (var i = game.buildings.length - 1; i >= 0; i--) {
        var item = game.buildings[i]
        for (var j = item.gridShape.length - 1; j >= 0; j--) {
          for (var k = item.gridShape[j].length - 1; k >= 0; k--) {
            if (item.gridShape[j][k] == 1) {
              game.obstructionGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = item.name
            }
          }
        }
      }
      for (var i = game.turrets.length - 1; i >= 0; i--) {
        var item = game.turrets[i]
        for (var j = item.gridShape.length - 1; j >= 0; j--) {
          for (var k = item.gridShape[j].length - 1; k >= 0; k--) {
            if (item.gridShape[j][k] == 1) {
              game.obstructionGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = item.name
            }
          }
        }
      }
      for (var i = game.walls.length - 1; i >= 0; i--) {
        var item = game.walls[i]
        for (var j = item.gridShape.length - 1; j >= 0; j--) {
          for (var k = item.gridShape[j].length - 1; k >= 0; k--) {
            if (item.gridShape[j][k] == 1) {
              game.obstructionGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = item.name
            }
          }
        }
      }
    }
    if (!game.foggedObstructionGrid) {
      game.foggedObstructionGrid = {}
    }
    for (var l = game.players.length - 1; l >= 0; l--) {
      var player = game.players[l]
      var fogGrid = fog.fogGrid[player]
      if (!game.foggedObstructionGrid[player]) {
        game.foggedObstructionGrid[player] = $.extend(true, [], game.obstructionGrid)
      }
      for (var j = game.foggedObstructionGrid[player].length - 1; j >= 0; j--) {
        for (var k = game.foggedObstructionGrid[player][j].length - 1; k >= 0; k--) {
          game.foggedObstructionGrid[player][j][k] = fogGrid[j][k] == 1 ? 0 : game.obstructionGrid[j][k] === 0 ? 0 : 1
        }
      }
    }
    if (sidebar.deployMode || game.selectedMCVs.length > 0) {
      game.foggedBuildableGrid = game.createFoggedBuildableGrid(game.player)
    }
  },
  createFoggedBuildableGrid: function (player) {
    var fogGrid = fog.fogGrid[player]
    var foggedBuildableGrid = $.extend(true, [], game.terrainGrid)
    for (var j = foggedBuildableGrid.length - 1; j >= 0; j--) {
      for (var k = foggedBuildableGrid[j].length - 1; k >= 0; k--) {
        foggedBuildableGrid[j][k] = fogGrid[j][k] == 1 ? 1 : game.terrainGrid[j][k]
      }
    }
    for (var i = game.buildings.length - 1; i >= 0; i--) {
      var item = game.buildings[i]
      for (var j = item.gridBuild.length - 1; j >= 0; j--) {
        for (var k = item.gridBuild[j].length - 1; k >= 0; k--) {
          if (item.gridBuild[j][k] == 1) {
            foggedBuildableGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = 1
          }
        }
      }
    }
    for (var i = game.turrets.length - 1; i >= 0; i--) {
      var item = game.turrets[i]
      for (var j = item.gridBuild.length - 1; j >= 0; j--) {
        for (var k = item.gridBuild[j].length - 1; k >= 0; k--) {
          if (item.gridBuild[j][k] == 1) {
            foggedBuildableGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = 1
          }
        }
      }
    }
    for (var i = game.walls.length - 1; i >= 0; i--) {
      var item = game.walls[i]
      for (var j = item.gridBuild.length - 1; j >= 0; j--) {
        for (var k = item.gridBuild[j].length - 1; k >= 0; k--) {
          if (item.gridBuild[j][k] == 1) {
            foggedBuildableGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = 1
          }
        }
      }
    }
    for (var i = game.tiberium.length - 1; i >= 0; i--) {
      var item = game.tiberium[i]
      for (var j = item.gridBuild.length - 1; j >= 0; j--) {
        for (var k = item.gridBuild[j].length - 1; k >= 0; k--) {
          if (item.gridBuild[j][k] == 1) {
            foggedBuildableGrid[Math.floor(item.y) + j][Math.floor(item.x) + k] = 1
          }
        }
      }
    }
    for (var i = game.vehicles.length - 1; i >= 0; i--) {
      var item = game.vehicles[i]
      if (item.name === 'mcv' && item.selected && mouse.objectUnderMouse == item && item.player == game.player) {} else {
        var yFloor = Math.floor(item.y)
        var xFloor = Math.floor(item.x)
        if (yFloor >= 0 && yFloor <= foggedBuildableGrid.length && xFloor >= 0 && xFloor < foggedBuildableGrid[0].length) {
          foggedBuildableGrid[Math.floor(item.y)][Math.floor(item.x)] = 1
        }
      }
    }
    for (var i = game.infantry.length - 1; i >= 0; i--) {
      var item = game.infantry[i]
      var yFloor = Math.floor(item.y)
      var xFloor = Math.floor(item.x)
      if (yFloor >= 0 && yFloor <= foggedBuildableGrid.length && xFloor >= 0 && xFloor < foggedBuildableGrid[0].length) {
        foggedBuildableGrid[Math.floor(item.y)][Math.floor(item.x)] = 1
      }
    }
    for (var i = game.aircraft.length - 1; i >= 0; i--) {
      var item = game.aircraft[i]
      var yFloor = Math.floor(item.y)
      var xFloor = Math.floor(item.x)
      if (item.z < 1 / 8 && yFloor >= 0 && yFloor <= foggedBuildableGrid.length && xFloor >= 0 && xFloor < foggedBuildableGrid[0].length) {
        foggedBuildableGrid[Math.floor(item.y)][Math.floor(item.x)] = 1
      }
    }
    return foggedBuildableGrid
  },
  canBuildOnFoggedGrid: function (building, foggedBuildableGrid) {
    var buildingType = window[building.type].list[building.name]
    var grid = $.extend(true, [], buildingType.gridBuild)
    var canBuildHere = true
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < grid[y].length; x++) {
        if (grid[y][x] == 1) {
          if (foggedBuildableGrid[building.y + y][building.x + x] !== 0) {
            return false
          }
        }
      }
    }
    return true
  },
  animationLoop: function () {
    mouse.setCursor()
    sidebar.animate()
    game.createGrids()
    game.buildingLandscapeChanged = false
    triggers.process()
    for (var i = game.items.length - 1; i >= 0; i--) {
      var item = game.items[i]
      if (item.processOrders) {
        item.processOrders()
      }
      item.animate()
      if (item.preRender) {
        item.preRender()
      }
    }
    for (var i = game.effects.length - 1; i >= 0; i--) {
      game.effects[i].animate()
    }
    for (var i = game.bullets.length - 1; i >= 0; i--) {
      game.bullets[i].animate()
    }
    fog.animate()
    game.sortedItemsArray = $.extend([], game.items)
    game.sortedItemsArray.sort(function (a, b) {
      var by = b.cgY ? b.cgY : b.y
      var ay = a.cgY ? a.cgY : a.y
      return (b.z - a.z) * 1.25 + (by - ay) + (by == ay ? a.x - b.x : 0)
    })
    game.lastAnimationTime = (new Date()).getTime()
  },
  drawingLoop: function () {
    game.foregroundContext.clearRect(0, 0, game.screenWidth, game.screenHeight)
    sidebar.draw()
    game.lastDrawTime = (new Date()).getTime()
    if (game.lastAnimationTime) {
      game.movementInterpolationFactor = (game.lastDrawTime - game.lastAnimationTime) / game.animationTimeout - 1
      if (game.movementInterpolationFactor > 0) {
        game.movementInterpolationFactor = 0
      }
    } else {
      game.movementInterpolationFactor = -1
    }
    game.foregroundContext.save()
    game.foregroundContext.beginPath()
    game.viewportWidth = sidebar.visible ? game.screenWidth - sidebar.width : game.screenWidth
    game.foregroundContext.rect(game.viewportLeft, game.viewportTop, game.viewportWidth - game.viewportLeft, game.viewportHeight)
    game.foregroundContext.clip()
    mouse.handlePanning()
    maps.draw()
    for (var i = game.sortedItemsArray.length - 1; i >= 0; i--) {
      game.sortedItemsArray[i].draw()
    }
    for (var i = game.effects.length - 1; i >= 0; i--) {
      game.effects[i].draw()
    }
    for (var i = game.bullets.length - 1; i >= 0; i--) {
      game.bullets[i].draw()
    }
    fog.draw()
    if (sidebar.deployMode && sidebar.deployBuilding) {
      var buildingType = sidebar.deployBuilding
      var grid = $.extend(true, [], buildingType.gridBuild)
      sidebar.canBuildHere = true
      sidebar.tooFarAway = true
      for (var i = game.buildings.length - 1; i >= 0; i--) {
        var building = game.buildings[i]
        if (building.player == game.player) {
          if (Math.abs(building.x + building.gridWidth / 2 - mouse.gridX - buildingType.gridWidth / 2) < building.gridWidth / 2 + buildingType.gridWidth / 2 + 2 && Math.abs(building.y + building.gridHeight / 2 - mouse.gridY - buildingType.gridHeight / 2) < building.gridHeight / 2 + buildingType.gridHeight / 2 + 3) {
            sidebar.tooFarAway = false
            break
          }
        }
      }
      for (var i = game.turrets.length - 1; i >= 0; i--) {
        var building = game.turrets[i]
        if (building.player == game.player) {
          if (Math.abs(building.x + building.gridWidth / 2 - mouse.gridX - buildingType.gridWidth / 2) < building.gridWidth / 2 + buildingType.gridWidth / 2 + 2 && Math.abs(building.y + building.gridHeight / 2 - mouse.gridY - buildingType.gridHeight / 2) < building.gridHeight / 2 + buildingType.gridHeight / 2 + 3) {
            sidebar.tooFarAway = false
            break
          }
        }
      }
      for (var y = 0; y < grid.length; y++) {
        for (var x = 0; x < grid[y].length; x++) {
          if (grid[y][x] == 1) {
            if (sidebar.tooFarAway || mouse.gridY + y < 0 || mouse.gridY + y >= game.foggedBuildableGrid.length || mouse.gridX + x < 0 || mouse.gridX + x >= game.foggedBuildableGrid[mouse.gridY + y].length || game.foggedBuildableGrid[mouse.gridY + y][mouse.gridX + x] !== 0) {
              game.highlightGrid(mouse.gridX + x, mouse.gridY + y, 1, 1, sidebar.placementRedImage)
              sidebar.canBuildHere = false
            } else {
              game.highlightGrid(mouse.gridX + x, mouse.gridY + y, 1, 1, sidebar.placementWhiteImage)
            }
          }
        }
      }
    }
    if (game.showEnding) {
      var endingImage = game.showEnding == 'success' ? sidebar.missionAccomplished : sidebar.missionFailed
      game.foregroundContext.drawImage(endingImage, game.viewportLeft + game.viewportWidth / 2 - endingImage.width / 2, game.viewportTop + game.viewportHeight / 2 - endingImage.height / 2)
    }
    game.foregroundContext.restore()
    if (game.type === 'multiplayer' && !game.replay) {
      game.foregroundContext.fillStyle = 'rgb(40,40,40)'
      game.foregroundContext.fillText('C: ' + game.gameTick, game.canvasWidth - 200, game.canvasHeight - 5)
      game.foregroundContext.fillText('S: ' + multiplayer.lastReceivedTick, game.canvasWidth - 100, game.canvasHeight - 5)
      if (multiplayer.gameLagging) {
        game.foregroundContext.fillText('Server Syncing...', 150, game.canvasHeight - 5)
      }
      game.foregroundContext.fillStyle = 'rgb(100,100,100)'
      game.foregroundContext.fillText('L: ' + multiplayer.averageLatency + ' ms', 20, game.canvasHeight - 5)
    }
    if (game.replay) {
      var replayTop = sidebar.top
      game.foregroundContext.drawImage(sidebar.replayMenuImage, 0, replayTop)
      if (game.type !== 'singleplayer') {
        game.foregroundContext.fillStyle = 'black'
        game.foregroundContext.fillRect(0, sidebar.top + 87, 130, 32)
      }
      game.foregroundContext.fillStyle = 'lightgreen'
      game.foregroundContext.font = '16px Command'
      game.foregroundContext.globalAlpha = sidebar.textBrightness
      game.foregroundContext.fillText('R E P L A Y', 32, replayTop + 20)
      game.foregroundContext.globalAlpha = 1
    }
    mouse.draw()
    if (game.running) {
      game.drawingInterval = requestAnimationFrame(game.drawingLoop)
    }
    if (!game.fps) {
      game.fps = []
    }
    game.fps.push(new Date())
    if (game.fps.length > 51) {
      game.fps.shift()
      var fps = Math.round(5e4 / (game.fps[50] - game.fps[0]))
      mouse.context.fillStyle = 'rgb(100,100,100)'
      mouse.context.fillText('FPS: ' + fps, 100, game.canvasHeight - 5)
    }
  },
  highlightGrid: function (i, j, width, height, optionalImage) {
    var gridSize = game.gridSize
    if (optionalImage && $(optionalImage).is('img')) {
      game.foregroundContext.drawImage(optionalImage, i * gridSize + game.viewportAdjustX, j * gridSize + game.viewportAdjustY, width * gridSize, height * gridSize)
    } else {
      if (optionalImage) {
        game.foregroundContext.fillStyle = optionalImage
      } else {
        game.foregroundContext.fillStyle = 'rgba(225,225,225,0.5)'
      }
      game.foregroundContext.fillRect(i * gridSize + game.viewportAdjustX, j * gridSize + game.viewportAdjustY, width * gridSize, height * gridSize)
    }
  },
  remove: function (item) {
    item.lifeCode = 'dead'
    if (item.selected) {
      item.selected = false
      for (var j = game.selectionArrays.length - 1; j >= 0; j--) {
        var type = game.selectionArrays[j]
        for (var i = game[type].length - 1; i >= 0; i--) {
          if (game[type][i].uid == item.uid) {
            game[type].splice(i, 1)
            break
          }
        }
      }
    }
    for (var i = game.items.length - 1; i >= 0; i--) {
      if (game.items[i].uid == item.uid) {
        game.items.splice(i, 1)
        break
      }
    }
    for (var i = game.attackableItems.length - 1; i >= 0; i--) {
      if (game.attackableItems[i].uid == item.uid) {
        game.attackableItems.splice(i, 1)
        break
      }
    }
    for (var j = game.controlGroups.length - 1; j >= 0; j--) {
      var group = game.controlGroups[j]
      if (group) {
        for (var i = group.length - 1; i >= 0; i--) {
          if (group[i].uid == item.uid) {
            group.splice(i, 1)
            break
          }
        }
      }
    }
    for (var i = game[item.type].length - 1; i >= 0; i--) {
      if (game[item.type][i].uid == item.uid) {
        game[item.type].splice(i, 1)
        break
      }
    }
    if (item.type == 'buildings' || item.type == 'turrets' || item.type == 'walls') {
      game.buildingLandscapeChanged = true
    }
  },
  add: function (item) {
    var object
    game.counter++
    if (item.uid == undefined) {
      item.uid = game.counter
    }
    if (item.type == 'buildings' || item.type == 'turrets' || item.type == 'walls') {
      game.buildingLandscapeChanged = true
    }
    switch (item.type) {
      case 'infantry':
      case 'vehicles':
      case 'ships':
      case 'buildings':
      case 'turrets':
      case 'walls':
      case 'aircraft':
        object = window[item.type].add(item)
        game[item.type].push(object)
        game.items.push(object)
        game.attackableItems.push(object)
        break
      case 'tiberium':
      case 'trees':
        object = window[item.type].add(item)
        game[item.type].push(object)
        game.items.push(object)
        break
      case 'triggers':
      case 'effects':
      case 'bullets':
        object = window[item.type].add(item)
        game[item.type].push(object)
        break
      default:
        console.log('Did not add ' + item.type + ' : ' + item.name)
        break
    }
    return object
  },
  gameSpeed: 1,
  scrollSpeed: 1,
  speedAdjustmentFactor: 6,
  selectionArrays: ['selectedItems', 'selectedUnits', 'selectedVehicles', 'selectedAttackers', 'selectedHarvesters', 'selectedEngineers', 'selectedInfantry', 'selectedCommandos', 'selectedMCVs', 'selectedAircraft'],
  itemArrays: ['attackableItems', 'vehicles', 'ships', 'infantry', 'buildings', 'turrets', 'effects', 'bullets', 'walls', 'aircraft', 'items', 'trees', 'tiberium', 'triggers', 'controlGroups', 'permissions', 'attackedPlayers', 'discoveredPlayers'],
  resetTypes: function () {
    game.counter = 1
    game.showEnding = false
    game.terrainGrid = undefined
    game.foggedObstructionGrid = undefined
    game.refreshBackground = true
    for (var i = game.itemArrays.length - 1; i >= 0; i--) {
      game[game.itemArrays[i]] = []
    }
    for (var j = game.selectionArrays.length - 1; j >= 0; j--) {
      game[game.selectionArrays[j]] = []
    }
  },
  selectItem: function (item, shiftPressed, multipleSelection) {
    if (shiftPressed && item.selected) {
      item.selected = false
      for (var j = game.selectionArrays.length - 1; j >= 0; j--) {
        game[game.selectionArrays[j]].remove(item)
      }
      return
    }
    item.selected = true
    this.selectedItems.push(item)
    if (item.type != 'buildings' && item.type != 'turrets' && item.type != 'ships' && item.type != 'walls' && item.player == game.player) {
      this.selectedUnits.push(item)
      if (!multipleSelection && !game.replay) {
        if (item.name == 'commando') {
          sounds.play('commando_select')
        } else {
          sounds.play(item.type + '_select')
        }
      }
      if (item.type == 'vehicles') {
        this.selectedVehicles.push(item)
      }
      if (item.primaryWeapon) {
        this.selectedAttackers.push(item)
      }
      if (item.name == 'harvester') {
        this.selectedHarvesters.push(item)
      }
      if (item.type == 'aircraft') {
        this.selectedAircraft.push(item)
      }
      if (item.type == 'infantry') {
        this.selectedInfantry.push(item)
      }
      if (item.name == 'engineer') {
        this.selectedEngineers.push(item)
      }
      if (item.name == 'commando') {
        this.selectedCommandos.push(item)
      }
      if (item.name == 'mcv') {
        this.selectedMCVs.push(item)
      }
    }
  },
  clearSelection: function () {
    for (var i = this.selectedItems.length - 1; i >= 0; i--) {
      this.selectedItems[i].selected = false
      this.selectedItems.splice(i, 1)
    }
    for (var j = game.selectionArrays.length - 1; j >= 0; j--) {
      game[game.selectionArrays[j]].length = 0
    }
  },
  click: function (ev, rightClick) {
    if (game.replay) {
      if (mouse.x >= 22 && mouse.x <= 124) {
        if (mouse.y >= 60 && mouse.y <= 85) {
          if (mouse.x >= 22 && mouse.x <= 52) {
            sounds.play('button')
            window[game.type].pauseReplay()
          } else if (mouse.x >= 56 && mouse.x <= 88) {
            sounds.play('button')
            window[game.type].resumeReplay()
          } else if (mouse.x >= 92 && mouse.x <= 124) {
            if (game.gameSpeed >= 8) {
              sounds.play('scold')
            } else {
              sounds.play('button')
              window[game.type].fastForwardReplay()
            }
          }
        } else if (mouse.y >= 94 && mouse.y <= 116) {
          sounds.play('button')
          window[game.type].exitReplay()
          return
        } else if (game.type === 'singleplayer' && mouse.y >= 126 && mouse.y <= 148) {
          sounds.play('button')
          singleplayer.resumeGameFromHere()
          return
        }
      }
    }
    var clickedObject = mouse.objectUnderMouse
    if (rightClick) {
      this.clearSelection()
      sidebar.repairMode = false
      sidebar.deployMode = false
      sidebar.sellMode = false
    } else if (sidebar.deployMode) {
      if (sidebar.deploySpecial) {
        sidebar.finishDeployingSpecial()
      } else if (sidebar.deployBuilding) {
        if (sidebar.canBuildHere) {
          sidebar.finishDeployingBuilding()
        } else {
          sounds.play('cannot_deploy_here')
        }
      }
    } else if (!rightClick && !mouse.dragSelect) {
      var commandUids = []
      if (clickedObject && clickedObject.name == 'mcv' && mouse.cursor == mouse.cursors['build_command'] && !game.replay) {
        game.sendCommand([clickedObject.uid], {
          type: 'deploy'
        })
      } else if (clickedObject && clickedObject.name == 'apc' && mouse.cursor == mouse.cursors['build_command'] && !game.replay) {
        game.sendCommand([clickedObject.uid], {
          type: 'unload'
        })
      } else if (clickedObject && clickedObject.name == 'chinook' && mouse.cursor == mouse.cursors['build_command'] && !game.replay) {
        game.sendCommand([clickedObject.uid], {
          type: 'unload'
        })
      } else if (clickedObject && mouse.cursor == mouse.cursors['sell'] && clickedObject.orders.type != 'sell') {
        game.sendCommand([clickedObject.uid], {
          type: 'sell'
        })
      } else if (clickedObject && clickedObject.name == 'apc' && game.selectedInfantry.length > 0 && mouse.cursor == mouse.cursors['load'] && !game.replay) {
        for (var i = game.selectedInfantry.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedInfantry[i].uid)
        }
        if (game.selectedCommandos.length > 0) {
          sounds.play('commando_move')
        } else {
          sounds.play('infantry_move')
        }
        game.sendCommand(commandUids, {
          type: 'load',
          uidto: clickedObject.uid
        })
        game.sendCommand([clickedObject.uid], {
          type: 'load'
        })
      } else if (clickedObject && clickedObject.name == 'chinook' && game.selectedInfantry.length > 0 && mouse.cursor == mouse.cursors['load'] && !game.replay) {
        for (var i = game.selectedInfantry.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedInfantry[i].uid)
        }
        if (game.selectedCommandos.length > 0) {
          sounds.play('commando_move')
        } else {
          sounds.play('infantry_move')
        }
        game.sendCommand(commandUids, {
          type: 'load',
          uidto: clickedObject.uid
        })
        game.sendCommand([clickedObject.uid], {
          type: 'load'
        })
      } else if (clickedObject && mouse.cursor == mouse.cursors['repair']) {
        if (clickedObject.repairing) {
          game.sendCommand([clickedObject.uid], {
            type: 'stop-repair'
          })
        } else {
          game.sendCommand([clickedObject.uid], {
            type: 'repair'
          })
        }
      } else if (clickedObject && game.selectedCommandos.length > 0 && mouse.cursor == mouse.cursors['detonate'] && !game.replay) {
        for (var i = game.selectedCommandos.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedCommandos[i].uid)
        }
        sounds.play('commando_move')
        game.sendCommand(commandUids, {
          type: 'infiltrate',
          uidto: clickedObject.uid
        })
      } else if (clickedObject && game.selectedEngineers.length > 0 && mouse.cursor == mouse.cursors['load'] && !game.replay) {
        for (var i = game.selectedEngineers.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedEngineers[i].uid)
        }
        sounds.play('infantry_move')
        game.sendCommand(commandUids, {
          type: 'infiltrate',
          uidto: clickedObject.uid
        })
      } else if (clickedObject && game.selectedVehicles.length > 0 && clickedObject.player == game.player && clickedObject.name == 'repair-facility' && !game.replay) {
        for (var i = game.selectedVehicles.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedVehicles[i].uid)
        }
        sounds.play('vehicles_move')
        game.sendCommand(commandUids, {
          type: 'move',
          to: {
            x: Math.round(16 * mouse.gameX / game.gridSize) / 16,
            y: Math.round(16 * mouse.gameY / game.gridSize) / 16
          }
        })
      } else if (clickedObject && game.selectedHarvesters.length > 0 && clickedObject.name == 'tiberium' && !game.replay) {
        for (var i = game.selectedHarvesters.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedHarvesters[i].uid)
        }
        sounds.play('vehicles_move')
        game.sendCommand(commandUids, {
          type: 'harvest',
          uidtiberium: clickedObject.uid
        })
      } else if (clickedObject && game.selectedAircraft.length > 0 && clickedObject.player == game.player && clickedObject.name == 'helipad' && !game.replay) {
        for (var i = game.selectedAircraft.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedAircraft[i].uid)
        }
        sounds.play('vehicles_move')
        game.sendCommand(commandUids, {
          type: 'return',
          uidhelipad: clickedObject.uid
        })
      } else if (clickedObject && game.selectedHarvesters.length > 0 && clickedObject.player == game.player && clickedObject.name == 'refinery' && !game.replay) {
        for (var i = game.selectedHarvesters.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedHarvesters[i].uid)
        }
        sounds.play('vehicles_move')
        game.sendCommand(commandUids, {
          type: 'harvest-return',
          uidrefinery: clickedObject.uid
        })
      } else if (clickedObject && game.selectedAttackers.length > 0 && mouse.objectUnderMouse.player != game.player && !mouse.objectUnderMouse.unattackable && !game.replay) {
        for (var i = game.selectedAttackers.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedAttackers[i].uid)
        }
        if (game.selectedCommandos.length > 0) {
          sounds.play('commando_move')
        } else {
          sounds.play(game.selectedAttackers[0].type + '_move')
        }
        game.sendCommand(commandUids, {
          type: 'attack',
          uidto: clickedObject.uid
        })
      } else if (clickedObject && !clickedObject.unselectable) {
        if (!ev.shiftKey) {
          this.clearSelection()
        }
        if (!clickedObject.unselectable) {
          this.selectItem(clickedObject, ev.shiftKey)
        }
      } else if (this.selectedUnits.length > 0 && !game.replay) {
        for (var i = game.selectedUnits.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedUnits[i].uid)
        }
        if (game.selectedCommandos.length > 0) {
          sounds.play('commando_move')
        } else {
          sounds.play(game.selectedUnits[0].type + '_move')
        }
        game.sendCommand(commandUids, {
          type: 'move',
          to: {
            x: Math.round(16 * mouse.gameX / game.gridSize) / 16,
            y: Math.round(16 * mouse.gameY / game.gridSize) / 16
          }
        })
      }
    }
  },
  sendCommand: function (commandUids, command) {
    if (game.replay) {
      return
    }
    if (game.type === 'singleplayer') {
      singleplayer.sendCommand(commandUids, command)
    } else {
      multiplayer.sendCommand(commandUids, command)
    }
  },
  getItemByUid: function (uid) {
    for (var i = game.items.length - 1; i >= 0; i--) {
      var item = game.items[i]
      if (item.uid === uid) {
        return item
      }
    }
  },
  receiveCommand: function (commandUids, command) {
    if (commandUids == 'sidebar') {
      sidebar.processOrders(command)
      return
    }
    for (var i = commandUids.length - 1; i >= 0; i--) {
      var item = game.getItemByUid(commandUids[i])
      if (item) {
        var orders = $.extend(true, {}, command)
        orders.to = orders.uidto ? game.getItemByUid(orders.uidto) : orders.to
        orders.refinery = orders.uidrefinery ? game.getItemByUid(orders.uidrefinery) : undefined
        orders.tiberium = orders.uidtiberium ? game.getItemByUid(orders.uidtiberium) : undefined
        orders.helipad = orders.uidhelipad ? game.getItemByUid(orders.uidhelipad) : undefined
        item.orders = orders
        item.animationIndex = 0
      }
    }
  },
  reset: function () {
    game.foregroundContext.clearRect(0, 0, game.canvasWidth, game.canvasHeight)
    game.backgroundContext.clearRect(0, 0, game.canvasWidth, game.canvasHeight)
    mouse.context.clearRect(0, 0, game.canvasWidth, game.canvasHeight)
  },
  count: function (type, player, uid, name) {
    if (!player) {
      return game[type].length
    } else {
      if (!uid) {
        var count = 0
        if (type) {
          for (var i = 0; i < game[type].length; i++) {
            if (game[type][i].player == player && (!name || name === game[type][i].name)) {
              count++
            }
          }
        } else {
          for (var i = 0; i < game.attackableItems.length; i++) {
            if (game.attackableItems[i].player == player) {
              count++
            }
          }
        }
        return count
      } else {
        var count = 0
        for (var i = 0; i < game.attackableItems.length; i++) {
          if (game.attackableItems[i].player == player && game.attackableItems[i].uid == uid) {
            count++
            break
          }
        }
        return count
      }
    }
  },
  keyPressed: function (ev) {
    if (!game.running && !videos.running) {
      return
    }
    var keyCode = ev.which
    var ctrlPressed = ev.ctrlKey
    if (videos.running) {
      if (keyCode == 27) {
        videos.stop()
      }
      return
    }
    if (game.running) {
      if (game.type == 'multiplayer' && !game.replay) {
        $inputbox = $('#gameinterfacescreen .input-message')
        if (game.chatMode) {
          if (keyCode == 13 || keyCode == 27) {
            if (keyCode == 27) {
              $inputbox.hide()
              game.chatMode = false
            } else if (keyCode == 13) {
              if ($inputbox.val() != '') {
                multiplayer.sendMessageToPlayers($inputbox.val())
                $inputbox.val('')
                $inputbox.focus()
              } else {
                $inputbox.hide()
                game.chatMode = false
              }
            }
          } else {
            return
          }
        } else {
          if ((keyCode == 13 || keyCode == 115) && !game.chatMode) {
            game.chatMode = true
            $inputbox.val('')
            $inputbox.show()
            $inputbox.focus()
          }
        }
      }
      if (keyCode >= 37 && keyCode <= 40) {
        if (keyCode >= 37 && keyCode <= 40) {
          switch (keyCode) {
            case 37:
              game.leftKeyPressed = true
              break
            case 38:
              game.upKeyPressed = true
              break
            case 39:
              game.rightKeyPressed = true
              break
            case 40:
              game.downKeyPressed = true
              break
          }
        }
      } else if (keyCode >= 48 && keyCode <= 57) {
        var keyNumber = keyCode - 48
        if (ctrlPressed) {
          if (game.selectedItems.length > 0) {
            game.controlGroups[keyNumber] = $.extend([], game.selectedItems)
            console.log('Control Group', keyNumber, 'now has', game.controlGroups[keyNumber].length, 'items')
          }
        } else {
          if (game.controlGroups[keyNumber]) {
            game.clearSelection()
            var lastUnit
            for (var i = game.controlGroups[keyNumber].length - 1; i >= 0; i--) {
              var item = game.controlGroups[keyNumber][i]
              if (item.lifeCode == 'dead') {
                game.controlGroups[keyNumber].splice(i, 1)
              } else {
                if (item.type == 'infantry' || item.type == 'vehicles') {
                  lastUnit = item
                }
                game.selectItem(item, ev.shiftKey, true)
              }
            }
            if (lastUnit && !game.replay) {
              sounds.play(lastUnit.type + '_select')
            }
          }
        }
      } else if (keyCode == 71 && game.selectedAttackers.length) {
        var commandUids = []
        for (var i = game.selectedAttackers.length - 1; i >= 0; i--) {
          commandUids.push(game.selectedAttackers[i].uid)
        }
        game.sendCommand(commandUids, {
          type: 'guard'
        })
        sounds.play(game.selectedAttackers[0].type + '_move')
      } else if (keyCode == 32 && game.running) {
        if (game.type == 'singleplayer') {
          singleplayer.gameOptions()
        } else {
          multiplayer.gameOptions()
        }
      } else if (keyCode == 72 && game.running) {
        var homeBase
        for (var i = game.buildings.length - 1; i >= 0; i--) {
          if (game.buildings[i].player == game.player && game.buildings[i].name == 'construction-yard') {
            homeBase = game.buildings[i]
            if (homeBase.primaryBuilding) {
              break
            }
          }
        }
        if (!homeBase) {
          for (var i = game.vehicles.length - 1; i >= 0; i--) {
            if (game.vehicles[i].player == game.player && game.vehicles[i].name == 'mcv') {
              homeBase = game.vehicles[i]
            }
          }
        }
        if (homeBase) {
          var x = homeBase.x * game.gridSize
          var y = homeBase.y * game.gridSize
          game.viewportX = Math.max(0, Math.min(x - game.viewportWidth / 2, maps.currentMapImage.width - game.viewportWidth))
          game.viewportY = Math.max(0, Math.min(y - game.viewportHeight / 2, maps.currentMapImage.height - game.viewportHeight))
          game.viewportAdjustX = 0
          game.viewportAdjustY = 0
          game.viewportDeltaX = 0
          game.viewportDeltaY = 0
          game.refreshBackground = true
        }
      } else {
        return
      }
    }
    ev.preventDefault()
    ev.stopPropagation()
    return false
  },
  keyReleased: function (ev) {
    var keyCode = ev.which
    if (keyCode >= 37 && keyCode <= 40) {
      switch (keyCode) {
        case 37:
          game.leftKeyPressed = false
          break
        case 38:
          game.upKeyPressed = false
          break
        case 39:
          game.rightKeyPressed = false
          break
        case 40:
          game.downKeyPressed = false
          break
      }
    }
  }
}
$(window).ready(function () {
  if (window !== top) {
    top.location.replace(document.location)
  }
  game.init()
})
var infantry = {
  type: 'infantry',
  list: {
    minigunner: {
      name: 'minigunner',
      label: 'Minigunner',
      speed: 8,
      primaryWeapon: 'm16',
      cost: 100,
      sight: 1,
      hitPoints: 50,
      spriteSheet: undefined,
      directions: 8,
      dependency: ['barracks|hand-of-nod'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fire',
        count: 8,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'prone-fire',
        count: 8,
        totalCount: 8,
        direction: true
      }, {
        name: 'idle-1',
        count: 16
      }, {
        name: 'idle-2',
        count: 16
      }, {
        name: 'fist-combat-left',
        count: 47
      }, {
        name: 'fist-combat-right',
        count: 47
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'wave',
        count: 3,
        direction: true
      }, {
        name: 'greet',
        count: 3,
        direction: true
      }, {
        name: 'salute',
        count: 3,
        direction: true
      }, {
        name: 'bow',
        count: 3,
        direction: true
      }, {
        name: 'prone',
        count: 1,
        totalCount: 4,
        direction: true,
        spriteCount: 144
      }]
    },
    sniper: {
      name: 'sniper',
      label: 'Sniper',
      speed: 4,
      primaryWeapon: 'sniper2',
      cost: 200,
      sight: 2,
      hitPoints: 50,
      spriteSheet: undefined,
      directions: 8,
      dependency: ['barracks|hand-of-nod'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'gdi',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fire',
        count: 8,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'prone-fire',
        count: 8,
        totalCount: 8,
        direction: true
      }, {
        name: 'idle-1',
        count: 16
      }, {
        name: 'idle-2',
        count: 16
      }, {
        name: 'fist-combat-left',
        count: 47
      }, {
        name: 'fist-combat-right',
        count: 47
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'wave',
        count: 3,
        direction: true
      }, {
        name: 'greet',
        count: 3,
        direction: true
      }, {
        name: 'salute',
        count: 3,
        direction: true
      }, {
        name: 'bow',
        count: 3,
        direction: true
      }, {
        name: 'prone',
        count: 1,
        totalCount: 4,
        direction: true,
        spriteCount: 144
      }]
    },
    grenadier: {
      name: 'grenadier',
      label: 'Grenadier',
      speed: 10,
      primaryWeapon: 'grenade',
      cost: 160,
      sight: 1,
      hitPoints: 50,
      spriteSheet: undefined,
      directions: 8,
      dependency: ['barracks|hand-of-nod'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'gdi',
      proneFireIndex: 6,
      fireIndex: 14,
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fire',
        count: 20,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'prone-fire',
        count: 8,
        totalCount: 12,
        direction: true
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'wave',
        count: 3,
        direction: true
      }, {
        name: 'greet',
        count: 3,
        direction: true
      }, {
        name: 'salute',
        count: 3,
        direction: true
      }, {
        name: 'bow',
        count: 3,
        direction: true
      }, {
        name: 'prone',
        count: 1,
        totalCount: 4,
        direction: true,
        spriteCount: 144
      }]
    },
    bazooka: {
      name: 'bazooka',
      label: 'Bazooka',
      speed: 8,
      primaryWeapon: 'rocket',
      cost: 300,
      sight: 2,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      dependency: ['barracks|hand-of-nod'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fire',
        count: 8,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'prone-fire',
        count: 10,
        totalCount: 10,
        direction: true
      }, {
        name: 'idle-1',
        count: 16
      }, {
        name: 'idle-2',
        count: 16
      }, {
        name: 'fist-combat-left',
        count: 47
      }, {
        name: 'fist-combat-right',
        count: 47
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'wave',
        count: 3,
        direction: true
      }, {
        name: 'greet',
        count: 3,
        direction: true
      }, {
        name: 'salute',
        count: 3,
        direction: true
      }, {
        name: 'bow',
        count: 3,
        direction: true
      }, {
        name: 'prone',
        count: 1,
        totalCount: 4,
        direction: true,
        spriteCount: 144
      }]
    },
    'flame-thrower': {
      name: 'flame-thrower',
      label: 'Flame Thrower',
      speed: 10,
      primaryWeapon: 'infantryflamer',
      cost: 200,
      sight: 1,
      hitPoints: 70,
      spriteSheet: undefined,
      directions: 8,
      dependency: ['barracks|hand-of-nod'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'nod',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fire',
        count: 16,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'prone-fire',
        count: 16,
        totalCount: 16,
        direction: true
      }, {
        name: 'idle-1',
        count: 16
      }, {
        name: 'idle-2',
        count: 16
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'prone',
        count: 1,
        totalCount: 16,
        direction: true,
        spriteCount: 256
      }]
    },
    'chem-warrior': {
      name: 'chem-warrior',
      label: 'Chem Warrior',
      speed: 8,
      primaryWeapon: 'chemspray',
      cost: 300,
      sight: 1,
      hitPoints: 70,
      spriteSheet: undefined,
      directions: 8,
      dependency: ['barracks|hand-of-nod', 'communications-center'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'nod',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fire',
        count: 16,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'prone-fire',
        count: 16,
        totalCount: 16,
        direction: true
      }, {
        name: 'idle-1',
        count: 16
      }, {
        name: 'idle-2',
        count: 16
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'prone',
        count: 1,
        totalCount: 16,
        direction: true,
        spriteCount: 256
      }]
    },
    commando: {
      name: 'commando',
      label: 'Commando',
      speed: 10,
      primaryWeapon: 'sniper',
      cost: 1e3,
      sight: 5,
      hitPoints: 80,
      spriteSheet: undefined,
      directions: 8,
      canInfiltrate: true,
      dependency: ['barracks|hand-of-nod', 'communications-center'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        totalCount: 4,
        direction: true
      }, {
        name: 'idle-1',
        count: 16
      }, {
        name: 'idle-2',
        count: 16
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'prone',
        count: 1,
        totalCount: 4,
        direction: true,
        spriteCount: 160
      }]
    },
    engineer: {
      name: 'engineer',
      label: 'Engineer',
      speed: 8,
      cost: 500,
      sight: 2,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      dependency: ['barracks|hand-of-nod'],
      constructedIn: ['barracks', 'hand-of-nod'],
      owner: 'both',
      canInfiltrate: true,
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'down',
        count: 2,
        direction: true
      }, {
        name: 'prone-move',
        count: 4,
        direction: true
      }, {
        name: 'up',
        count: 2,
        direction: true
      }, {
        name: 'idle-1',
        count: 16
      }, {
        name: 'die-normal',
        count: 8
      }, {
        name: 'die-frag',
        count: 8
      }, {
        name: 'die-explode-close',
        count: 8
      }, {
        name: 'die-explode-far',
        count: 12
      }, {
        name: 'die-fire',
        count: 18
      }, {
        name: 'wave',
        count: 3,
        direction: true
      }, {
        name: 'greet',
        count: 3,
        direction: true
      }, {
        name: 'salute',
        count: 3,
        direction: true
      }, {
        name: 'prone',
        count: 1,
        totalCount: 4,
        spriteCount: 66,
        direction: true
      }]
    },
    'civilian-1': {
      name: 'civilian-1',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: 'pistol',
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-2': {
      name: 'civilian-2',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: undefined,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-3': {
      name: 'civilian-3',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: undefined,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-4': {
      name: 'civilian-4',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: undefined,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-5': {
      name: 'civilian-5',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: undefined,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-6': {
      name: 'civilian-6',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: undefined,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-7': {
      name: 'civilian-7',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: 'pistol',
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-8': {
      name: 'civilian-9',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: undefined,
      hitPoints: 25,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-9': {
      name: 'civilian-9',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: 'pistol',
      hitPoints: 5,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    },
    'civilian-10': {
      name: 'civilian-10',
      label: 'Civilian',
      speed: 10,
      cost: 10,
      sight: 0,
      primaryWeapon: undefined,
      hitPoints: 50,
      spriteSheet: undefined,
      directions: 8,
      constructedIn: [],
      owner: 'both',
      spriteImages: [{
        name: 'stand',
        count: 8
      }, {
        name: 'guard',
        count: 8,
        spriteCount: 0
      }, {
        name: 'prone',
        count: 1,
        totalCount: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'prone-move',
        count: 6,
        direction: true,
        spriteCount: 8
      }, {
        name: 'run',
        count: 6,
        direction: true
      }, {
        name: 'fist-combat-left',
        count: 43
      }, {
        name: 'fist-combat-right',
        count: 42
      }, {
        name: 'idle-1',
        count: 10
      }, {
        name: 'idle-2',
        count: 6
      }, {
        name: 'fire',
        count: 4,
        direction: true
      }, {
        name: 'prone-fire',
        count: 4,
        direction: true,
        spriteCount: 205
      }, {
        name: 'executed',
        count: 6,
        spriteCount: 277
      }, {
        name: 'die-normal',
        count: 8,
        spriteCount: 329
      }, {
        name: 'die-frag',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-close',
        count: 8,
        spriteCount: 337
      }, {
        name: 'die-explode-far',
        count: 12,
        spriteCount: 345
      }, {
        name: 'die-fire',
        count: 18,
        spriteCount: 357
      }]
    }
  },
  defaults: {
    action: 'stand',
    z: 0,
    orders: {
      type: 'stand'
    },
    direction: 4,
    armor: 0,
    animationIndex: 0,
    fireIndex: 0,
    proneFireIndex: 0,
    selected: false,
    lastMovementX: 0,
    lastMovementY: 0,
    nearCount: 0,
    crushable: true,
    pixelOffsetX: -26,
    pixelOffsetY: -16,
    selectOffsetX: -16,
    selectOffsetY: -10,
    pixelHeight: 39,
    pixelWidth: 50,
    softCollisionRadius: 4,
    hardCollisionRadius: 2,
    path: undefined,
    turnTo: function (toDirection) {
      var turnDirection = angleDiff(this.direction, toDirection, this.directions)
      if (turnDirection) {
        var turnAmount = turnDirection / Math.abs(turnDirection)
        this.direction = wrapDirection(this.direction + turnAmount, this.directions)
      }
    },
    checkCollision: checkCollision,
    moveTo: moveTo,
    canAttackEnemy: canAttackEnemy,
    findEnemyInRange: findEnemyInRange,
    hasReached: function () {
      if (Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 9) {
        if (this.colliding) {
          this.nearCount++
        }
      } else {
        this.nearCount = 0
      }
      if (Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 0.25 || Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 1 && this.nearCount > 10 || Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 4 && this.nearCount > 20 || Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 9 && this.nearCount > 30) {
        this.nearCount = 0
        return true
      }
      return false
    },
    processOrders: function () {
      this.lifeCode = getLifeCode(this)
      if (this.lifeCode == 'dead' && this.orders.type != 'die') {
        this.unselectable = true
        if (this.selected) {
          game.selectItem(this, true)
        }
        this.orders = {
          type: 'die'
        }
        this.action = this.infantryDeath
        this.animationIndex = 0
        switch (this.infantryDeath) {
          case 'die-normal':
          case 'die-frag':
          case 'die-explode-close':
          case 'die-explode-far':
            sounds.play('infantry_die')
            break
          case 'die-fire':
            sounds.play('infantry_die_fire')
            break
          case 'die-squish':
            this.action = 'die-normal'
            sounds.play('infantry_die_squish')
            break
        }
      }
      this.lastMovementX = 0
      this.lastMovementY = 0
      this.firing = false
      if (this.weapon && this.weapon.cooldown > 0) {
        this.weapon.cooldown--
      }
      if (this.attacked) {
        this.attacked = false
        this.prone = true
        this.attackedCycles = 50
      }
      if (this.prone) {
        this.attackedCycles--
        if (this.attackedCycles <= 0) {
          this.prone = false
        }
      }
      var newDirection
      var nearestEnemy
      switch (this.orders.type) {
        case 'stand':
          if (this.prone) {
            this.action = 'prone'
          } else {
            this.action = 'stand'
          }
          this.moving = false
          if (this.weapon) {
            var enemy = this.findEnemyInRange()
            if (enemy) {
              this.orders = {
                type: 'attack',
                to: enemy,
                lastOrder: {
                  type: this.orders.type
                }
              }
            }
          }
          break
        case 'move':
          this.moving = true
          if (this.hasReached()) {
            if (this.orders.lastOrder) {
              this.orders = this.orders.lastOrder
            } else {
              this.orders = {
                type: 'stand'
              }
            }
          } else {
            if (this.prone) {
              this.action = 'prone-move'
            } else {
              this.action = 'run'
            }
            if (!this.moveTo(this.orders.to)) {
              this.orders = {
                type: 'stand'
              }
            }
          }
          break
        case 'attack':
          if (!this.orders.to || this.orders.to.lifeCode == 'dead' || this.orders.to.player == this.player || !this.canAttackEnemy(this.orders.to)) {
            if (this.orders.lastOrder) {
              this.orders = this.orders.lastOrder
            } else {
              this.orders = {
                type: 'guard'
              }
            }
            return
          }
          if (Math.pow(this.orders.to.cgX - this.x, 2) + Math.pow(this.orders.to.cgY - this.y, 2) < Math.pow(this.weapon.range - 1 + this.orders.to.hardCollisionRadius / game.gridSize, 2)) {
            this.moving = false
            if (this.action == 'prone-move' || this.action == 'run') {
              this.animationIndex = 0
              if (this.prone) {
                this.action = 'prone'
              } else {
                this.action = 'stand'
              }
            }
            newDirection = findAngle(this.orders.to, this, this.directions)
            if (newDirection != this.direction) {
              if (this.prone) {
                this.action = 'prone'
              } else {
                this.action = 'guard'
              }
              this.turnTo(newDirection)
            } else {
              if (this.weapon.cooldown <= 0) {
                if (this.action != 'prone-fire' && this.action != 'fire') {
                  this.animationIndex = 0
                }
                if (this.prone) {
                  this.action = 'prone-fire'
                  if (this.proneFireIndex == this.animationIndex) {
                    this.weapon.fire(this, this.direction, this.orders.to)
                  }
                } else {
                  this.action = 'fire'
                  if (this.fireIndex == this.animationIndex) {
                    this.weapon.fire(this, this.direction, this.orders.to)
                  }
                }
              }
            }
          } else {
            this.moving = true
            if (this.prone) {
              this.action = 'prone-move'
            } else {
              this.action = 'run'
            }
            if (!this.moveTo(this.orders.to)) {
              if (this.orders.lastOrder) {
                this.orders = this.orders.lastOrder
              } else {
                this.orders = {
                  type: 'guard'
                }
              }
            }
          }
          break
        case 'area guard':
          if (!this.orders.to) {
            this.orders.to = {
              x: this.x,
              y: this.y
            }
          }
          if (this.weapon) {
            nearestEnemy = this.findEnemyInRange()
            if (nearestEnemy) {
              this.orders = {
                type: 'attack',
                lastOrder: this.orders,
                to: nearestEnemy
              }
              return
            }
          } else {
            this.orders = {
              type: 'panic'
            }
          }
          if (this.orders.to && !this.hasReached() && this.moveTo(this.orders.to)) {
            this.moving = true
            if (this.prone) {
              this.action = 'prone-move'
            } else {
              this.action = 'run'
            }
          } else {
            if (this.prone) {
              this.action = 'prone'
            } else {
              this.action = 'guard'
            }
            this.moving = false
          }
          break
        case 'guard':
        case 'hunt':
          if (this.weapon) {
            nearestEnemy = this.findEnemyInRange()
            if (nearestEnemy) {
              this.orders = {
                type: 'attack',
                lastOrder: this.orders,
                to: nearestEnemy
              }
            } else {
              if (this.prone) {
                this.action = 'prone'
              } else {
                this.action = 'guard'
              }
              this.moving = false
            }
          } else {
            this.orders = {
              type: 'panic'
            }
          }
          break
        case 'die':
          break
        case 'sticky':
          if (this.prone) {
            if (this.weapon) {} else {
              this.orders = {
                type: 'panic'
              }
            }
          }
          break
        case 'panic':
          this.prone = true
          this.action = 'prone-move'
          if (!this.orders.to || this.hasReached() || !this.moveTo(this.orders.to)) {
            this.orders.to = {
              x: this.x + game.gameTick % 5 - 2,
              y: this.y + game.gameTick % 3 - 1
            }
          }
          break
        case 'load':
          if (!this.orders.to || this.orders.to.lifeCode == 'dead' || this.orders.to.cargo.length >= this.orders.to.maxCargo) {
            this.orders = {
              type: 'stand'
            }
            break
          }
          var target = {
            x: this.orders.to.cgX,
            y: this.orders.to.cgY + 0.4
          }
          var distanceFromTarget = Math.sqrt(Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2))
          this.distanceFromTarget = distanceFromTarget
          if (distanceFromTarget < 3) {
            this.orders.to.orders = {
              type: 'load'
            }
          }
          if (distanceFromTarget < 1.3) {
            this.moving = false
            newDirection = findAngle(this.orders.to, this, this.directions)
            if (newDirection != this.direction) {
              if (this.prone) {
                this.action = 'prone-move'
              } else {
                this.action = 'run'
              }
              this.turnTo(newDirection)
            } else {
              if (this.orders.to.action == 'load') {
                this.orders.to.cargo.push(this)
                this.orders.to.orders = {
                  type: 'finish-load'
                }
                this.orders = {
                  type: 'stand'
                }
                game.remove(this)
              } else {
                this.orders.to.orders = {
                  type: 'load'
                }
              }
            }
          } else {
            this.moving = true
            if (this.prone) {
              this.action = 'prone-move'
            } else {
              this.action = 'run'
            }
            if (!this.moveTo(target)) {
              this.orders = {
                type: 'stand'
              }
            }
          }
          break
        case 'infiltrate':
          if (!this.orders.to || this.orders.to.lifeCode == 'dead' || this.orders.to.player == this.player) {
            this.orders = {
              type: 'stand'
            }
            break
          }
          var destination = {}
          destination.y = this.orders.to.y + this.orders.to.gridShape.length - 0.5
          destination.cgX = this.orders.to.cgX
          if (this.x < this.orders.to.cgX) {
            destination.x = this.orders.to.x + 0.5
          } else {
            destination.x = this.orders.to.x + this.orders.to.gridShape[0].length - 0.5
          }
          var distanceCorner = Math.pow(destination.x - this.x, 2) + Math.pow(destination.y - this.y, 2)
          var distanceCG = Math.pow(destination.cgX - this.x, 2) + Math.pow(destination.y - this.y, 2)
          if (this.name == 'engineer') {
            if (distanceCorner < 1 || distanceCG < 1) {
              if (!this.orders.counter) {
                this.orders.counter = 5
              } else {
                this.orders.counter--
                if (this.orders.counter > 1) {
                  this.moveToDestination()
                } else {
                  if (this.orders.to.team == 'gdi') {
                    sounds.play('gdi_building_captured')
                  } else {
                    sounds.play('nod_building_captured')
                  }
                  this.orders.to.originalteam = this.orders.to.originalteam || this.orders.to.team
                  this.orders.to.player = this.player
                  this.orders.to.team = this.team
                  game.remove(this)
                }
              }
            } else {
              this.moveToDestination()
            }
          } else {
            if (distanceCorner < 1.5 || distanceCG < 1.5) {
              if (!this.orders.counter) {
                sounds.play('commando_bomb')
                this.orders.counter = 25
              } else {
                this.orders.counter--
                if (this.orders.counter > 2 && distanceCorner > 1 && distanceCG > 1) {
                  this.moveToDestination()
                } else if (this.orders.counter > 1) {
                  if (this.prone) {
                    this.action = 'prone'
                  } else {
                    this.action = 'stand'
                  }
                } else {
                  this.orders.to.timeBomb = 20
                  this.orders = {
                    type: 'move',
                    to: findClosestEmptySpot(this, {
                      minimumRadius: 2
                    })
                  }
                }
              }
            } else {
              this.moveToDestination()
            }
          }
          break
      }
    },
    moveToDestination: function () {
      this.moving = true
      if (this.prone) {
        this.action = 'prone-move'
      } else {
        this.action = 'run'
      }
      if (!this.moveTo(this.orders.to)) {
        this.moving = 'false'
        newDirection = findAngle(this.orders.to, this, this.directions)
        this.turnTo(newDirection)
        if (this.prone) {
          this.action = 'prone'
        } else {
          this.action = 'stand'
        }
      }
    },
    drawSelection: function () {
      var x = this.selectOffsetX - this.pixelOffsetX
      var y = this.selectOffsetY - this.pixelOffsetY
      this.context.drawImage(this.selectImage, x, y)
      var selectBarHeight = 3
      var selectBarWidth = 12
      this.context.beginPath()
      this.context.rect(x + 9, y - selectBarHeight, selectBarWidth * this.life / this.hitPoints, selectBarHeight)
      if (this.lifeCode == 'healthy') {
        this.context.fillStyle = 'lightgreen'
      } else if (this.lifeCode == 'damaged') {
        this.context.fillStyle = 'yellow'
      } else {
        this.context.fillStyle = 'red'
      }
      this.context.fill()
      this.context.beginPath()
      this.context.strokeStyle = 'black'
      this.context.rect(x + 9, y - selectBarHeight, selectBarWidth, selectBarHeight)
      this.context.stroke()
    },
    preRender: function () {
      var x = 0
      var y = 0
      this.context.clearRect(0, 0, this.pixelWidth, this.pixelHeight)
      this.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight)
      if (this.selected) {
        this.drawSelection()
      }
    },
    draw: function () {
      if (this.action == 'hide') {
        return
      }
      var interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX
      var interpolatedY = this.y + game.movementInterpolationFactor * this.lastMovementY
      var x = Math.round(interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft
      var y = Math.round(interpolatedY * game.gridSize) - game.viewportY + game.viewportTop
      if (x < -this.pixelWidth || y < -this.pixelHeight || x > game.viewportWidth + this.pixelWidth || y > game.viewportHeight + this.pixelHeight) {
        return
      }
      game.foregroundContext.drawImage(this.canvas, x + this.pixelOffsetX, y + this.pixelOffsetY)
    },
    animate: function () {
      this.cgX = this.x
      this.cgY = this.y
      this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight
      switch (this.action) {
        case 'run':
        case 'fire':
        case 'prone':
        case 'prone-move':
        case 'prone-fire':
        case 'down':
        case 'up':
          this.imageList = this.spriteArray[this.action + '-' + this.direction]
          if (!this.imageList) {
            alert('no action called : ' + this.action)
          }
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            this.animationIndex = 0
            if (this.action == 'up') {
              this.action = 'stand'
            }
            if (this.action == 'down') {
              this.action = 'prone'
            }
            if (this.action == 'fire') {
              this.action = 'guard'
            }
            if (this.action == 'prone-fire') {
              this.action = 'prone'
            }
          }
          break
        case 'die-normal':
        case 'die-frag':
        case 'die-explode-close':
        case 'die-explode-far':
        case 'die-fire':
          this.imageList = this.spriteArray[this.action]
          this.imageOffset = this.imageList.offset + this.animationIndex
          this.animationIndex++
          if (this.animationIndex >= this.imageList.count) {
            if (!this.deadCount) {
              this.deadCount = 0
            }
            this.deadCount++
            this.animationIndex = this.imageList.count - 1
            if (this.deadCount >= 15) {
              game.remove(this)
              game.kills[this.attackedBy]++
              game.deaths[this.player]++
            }
          }
          break
        case 'guard':
          this.imageList = this.spriteArray['guard']
          if (!this.imageList) {
            alert(this.name)
          }
          this.imageOffset = this.imageList.offset + this.direction
          break
        case 'stand':
          this.imageList = this.spriteArray['stand']
          this.imageOffset = this.imageList.offset + this.direction
          break
        case 'hide':
          break
        default:
          alert('no action called : ' + this.action)
          console.log(this.name)
          break
      }
    }
  },
  add: function (details) {
    var item = {}
    var name = details.name
    $.extend(item, this.defaults)
    $.extend(item, this.list[name])
    if (details.percentLife) {
      item.life = item.hitPoints * details.percentLife
      delete item.percentLife
    } else {
      item.life = item.hitPoints
    }
    $.extend(item, details)
    if (item.primaryWeapon) {
      item.weapon = weapons.add({
        name: item.primaryWeapon
      })
    }
    item.canvas = document.createElement('canvas')
    item.canvas.width = item.pixelWidth
    item.canvas.height = item.pixelHeight
    item.context = item.canvas.getContext('2d')
    return item
  },
  load: function (name) {
    var item = this.list[name]
    console.log('Loading', name, '...')
    item.type = this.type
    item.spriteCanvas = document.createElement('canvas')
    item.spriteSheet = loader.loadImage('images/' + this.type + '/' + name + '-sprite-sheet.png', function (image) {
      createSpriteSheetCanvas(image, item.spriteCanvas, 'grayscale')
    })
    item.selectImage = sidebar.selectImageSmall
    item.spriteArray = []
    item.spriteCount = 0
    for (var i = 0; i < item.spriteImages.length; i++) {
      var constructImageCount = item.spriteImages[i].count
      var totalImageCount = item.spriteImages[i].totalCount || item.spriteImages[i].count
      var constructImageName = item.spriteImages[i].name
      if (typeof item.spriteImages[i].spriteCount !== 'undefined') {
        item.spriteCount = item.spriteImages[i].spriteCount
      }
      if (item.spriteImages[i].direction) {
        for (var j = 0; j < item.directions; j++) {
          item.spriteArray[constructImageName + '-' + j] = {
            name: constructImageName + '-' + j,
            count: constructImageCount,
            offset: item.spriteCount
          }
          item.spriteCount += totalImageCount
        }
      } else {
        if (typeof item.spriteImages[i].spriteCount !== 'undefined') {
          item.spriteCount = item.spriteImages[i].spriteCount
        }
        item.spriteArray[constructImageName] = {
          name: constructImageName,
          count: constructImageCount,
          offset: item.spriteCount
        }
        item.spriteCount += constructImageCount
      }
    }
  }
}
var maps = {
  gdi: ['scg02ea', 'scg01ea'],
  nod: ['nod02', 'scb01ea'],
  multiplayer: ['green-acres', 'sand-trap', 'lost-arena', 'river-raid', 'eye-of-the-storm'],
  load: function (mapName, onloadEventHandler, savedGame) {
    $.ajax({
      url: 'maps/' + mapName + '.js',
      dataType: 'json',
      success: function (data) {
        maps.loadMapData(mapName, data, onloadEventHandler, savedGame)
      },
      error: function (data, status) {
        menus.showMessageBox(status, data, function () {
          menus.show('game-type')
        })
      }
    })
  },
  draw: function () {
    if (game.refreshBackground) {
      game.backgroundContext.drawImage(maps.currentMapImage, game.viewportX, game.viewportY, game.viewportWidth - 1, game.viewportHeight, game.viewportLeft, game.viewportTop, game.viewportWidth, game.viewportHeight - 1)
      game.refreshBackground = false
    }
  },
  currentMapData: undefined,
  loadMapData: function (mapName, data, onloadEventHandler, savedGame) {
    game.backgroundContext.fillStyle = 'black'
    game.backgroundContext.fillRect(0, 0, game.canvasWidth, game.canvasHeight)
    game.foregroundContext.fillStyle = 'black'
    game.foregroundContext.fillRect(0, 0, game.canvasWidth, game.canvasHeight)
    mouse.context.clearRect(0, 0, game.canvasWidth, game.canvasHeight)
    maps.currentMapData = data
    maps.currentMapImage = loader.loadImage('images/maps/' + mapName + '.jpg')
    game.resetTypes()
    maps.currentMapTerrain = []
    for (var i = 0; i < data.height; i++) {
      maps.currentMapTerrain[i] = Array(data.width)
    }
    if (data.videos) {
      for (var videoType in data.videos) {
        videos.load(data.videos[videoType])
      }
    }
    var terrainTypes = Object.keys(data.terrain).sort()
    for (var tt = terrainTypes.length - 1; tt >= 0; tt--) {
      var terrainType = terrainTypes[tt]
      var terrainArray = data.terrain[terrainType]
      for (var i = terrainArray.length - 1; i >= 0; i--) {
        maps.currentMapTerrain[terrainArray[i][1]][terrainArray[i][0]] = terrainType
      }
    }
    if (game.type === 'multiplayer' || data.name == 'testbed') {
      data.requirements = $.extend(data.requirements, {
        infantry: ['minigunner', 'engineer', 'bazooka', 'grenadier', 'flame-thrower', 'chem-warrior', 'commando'],
        vehicles: ['apc', 'flame-tank', 'stealth-tank', 'mammoth-tank', 'harvester', 'mcv', 'jeep', 'recon-bike', 'buggy', 'light-tank', 'medium-tank', 'mobile-rocket-launch-system', 'ssm-launcher', 'artillery'],
        aircraft: ['orca', 'apache', 'chinook'],
        turrets: ['gun-turret', 'guard-tower', 'obelisk', 'advanced-guard-tower', 'sam-site'],
        buildings: ['refinery', 'construction-yard', 'power-plant', 'helipad', 'advanced-power-plant', 'barracks', 'tiberium-silo', 'communications-center', 'advanced-communications-tower', 'temple-of-nod', 'hand-of-nod', 'airstrip', 'weapons-factory', 'repair-facility'],
        tiberium: ['tiberium'],
        walls: ['sandbag', 'chain-link', 'concrete-wall'],
        special: ['nuclear-strike', 'ion-cannon']
      })
      data.buildable = {
        infantry: ['bazooka', 'grenadier', 'engineer', 'minigunner', 'flame-thrower', 'chem-warrior', 'commando'],
        turrets: ['gun-turret', 'guard-tower', 'obelisk', 'advanced-guard-tower', 'sam-site'],
        aircraft: ['orca', 'apache', 'chinook'],
        buildings: ['power-plant', 'advanced-power-plant', 'communications-center', 'advanced-communications-tower', 'temple-of-nod', 'tiberium-silo', 'barracks', 'hand-of-nod', 'refinery', 'airstrip', 'weapons-factory', 'repair-facility', 'helipad'],
        vehicles: ['apc', 'stealth-tank', 'flame-tank', 'mammoth-tank', 'harvester', 'jeep', 'recon-bike', 'buggy', 'light-tank', 'medium-tank', 'mcv', 'mobile-rocket-launch-system', 'ssm-launcher', 'artillery'],
        walls: ['sandbag', 'chain-link', 'concrete-wall'],
        special: ['nuclear-strike', 'ion-cannon']
      }
    }
    if (game.type === 'multiplayer') {
      data.startingunits = {
        nod: {
          vehicles: [{
            name: 'buggy',
            dx: 0,
            dy: 0.5,
            direction: 16
          }, {
            name: 'mcv',
            dx: 2,
            dy: 0.5,
            direction: 16
          }],
          infantry: [{
            name: 'minigunner',
            dx: 4.25,
            dy: 0.25
          }, {
            name: 'minigunner',
            dx: 4.75,
            dy: 0.75
          }, {
            name: 'minigunner',
            dx: 4.75,
            dy: 0.25
          }, {
            name: 'minigunner',
            dx: 4.25,
            dy: 0.75
          }]
        },
        gdi: {
          vehicles: [{
            name: 'jeep',
            dx: 0,
            dy: 0.5,
            direction: 16
          }, {
            name: 'mcv',
            dx: 2,
            dy: 0.5,
            direction: 16
          }],
          infantry: [{
            name: 'minigunner',
            dx: 4.25,
            dy: 0.25
          }, {
            name: 'minigunner',
            dx: 4.75,
            dy: 0.75
          }, {
            name: 'minigunner',
            dx: 4.75,
            dy: 0.25
          }, {
            name: 'minigunner',
            dx: 4.25,
            dy: 0.75
          }]
        }
      }
    }
    var requirementsTypes = Object.keys(data.requirements).sort()
    for (var rt = requirementsTypes.length - 1; rt >= 0; rt--) {
      var type = requirementsTypes[rt]
      var requirementArray = data.requirements[type]
      for (var i = 0; i < requirementArray.length; i++) {
        var name = requirementArray[i]
        if (window[type]) {
          window[type].load(name)
        } else {
          console.log('Not loading type :', type)
        }
      }
    }
    if (game.type === 'singleplayer') {
      singleplayer.initializeLevel(data)
      game.viewportX = data.x * game.gridSize
      game.viewportY = data.y * game.gridSize
    } else {
      multiplayer.initializeLevel(data)
    }
    fog.init()
    if (loader.loaded) {
      onloadEventHandler()
    } else {
      loader.onload = onloadEventHandler
    }
  }
}
var menus = {
  list: {
    'game-type': {
      background: 'none',
      images: ['game-type-menu.png'],
      onshow: function () {
        setTimeout(game.reset, 200)
      }
    },
    'select-campaign': {
      background: 'black',
      images: ['select-transmission-animation.gif', 'select-transmission.png'],
      onshow: function () {
        sounds.startStruggle()
      }
    },
    'message-box': {
      background: 'none',
      images: ['message-box.jpg']
    },
    'load-mission': {
      background: 'none',
      images: ['load-mission-menu.png']
    },
    'replay-game': {
      background: 'none',
      images: ['replay-game-menu.png'],
      onshow: function () {
        setTimeout(game.reset, 200)
      }
    },
    'delete-mission': {
      background: 'none',
      images: ['delete-mission-menu.png']
    },
    'save-mission': {
      background: 'none',
      images: ['save-mission-menu.png']
    },
    'singleplayer-game-options': {
      background: 'none',
      images: ['game-options-menu.png']
    },
    'multiplayer-game-options': {
      background: 'none',
      images: ['multiplayer-game-options-menu.png']
    },
    'abort-mission': {
      background: 'none',
      images: ['abort-mission-menu.png']
    },
    'restate-mission': {
      background: 'none',
      images: ['restate-mission-menu.png']
    },
    'game-controls': {
      background: 'none',
      images: ['game-controls-menu.png', 'slider.png']
    },
    'mission-ended': {
      background: 'none'
    },
    'sound-controls': {
      background: 'none',
      images: ['sound-controls-menu.png', 'slider-small.png']
    },
    'join-network-game': {
      background: 'none',
      images: ['join-network-game-menu.png'],
      onshow: function () {
        $('#join-network-game-menu-div .player-name').focus()
        $('#join-network-game-menu-div input').attr('disabled', false)
      }
    },
    'start-network-game': {
      background: 'none',
      images: ['start-network-game-menu.png'],
      onshow: function () {
        $('#start-network-game-menu-div input').attr('disabled', false)
      }
    },
    'joined-network-game': {
      background: 'none',
      images: ['joined-network-game-menu.png']
    }
  },
  notYetImplemented: function (feature) {
    var plural = feature.substring(feature.length - 1) == 's'
    menus.showMessageBox(feature + ' ' + (plural ? 'Are' : 'Is') + ' Coming Soon', feature + ' ' + (plural ? 'have' : 'has') + " not yet been implemented completely. I have enabled this menu option because I plan to release this feature soon.<br><br>Keep checking the <a href='http://www.facebook.com/CommandConquerHtml5' target='_blank'>C&amp;C - HTML5 Facebook Page</a> for updates :)")
  },
  load: function () {
    for (var menuName in menus.list) {
      var menu = menus.list[menuName]
      if (menu.images) {
        for (var i = menu.images.length - 1; i >= 0; i--) {
          loader.loadImage('images/menu/' + menu.images[i])
        }
      }
    }
    $('#game-type-menu-div .singleplayer-game').click(singleplayer.start)
    $('#game-type-menu-div .load-game').click(function () {
      $('#load-mission-menu-div .cancel-button').unbind('click').click(function () {
        menus.show('game-type')
      })
      singleplayer.updateSavedMissionList()
      menus.show('load-mission')
    })
    $('#singleplayer-game-options-menu-div .load-mission-button').click(function () {
      $('#load-mission-menu-div .cancel-button').unbind('click').click(function () {
        menus.show('singleplayer-game-options')
      })
      singleplayer.updateSavedMissionList()
      menus.show('load-mission')
    })
    $('#load-mission-menu-div .load-button').click(function () {
      singleplayer.loadMission($('#load-mission-menu-div .mission-list').prop('selectedIndex'))
    })
    $('#game-type-menu-div .multiplayer-game').click(function () {
      multiplayer.start()
    })
    $('#game-type-menu-div .view-game-replay').click(function () {
      singleplayer.updateSavedMissionList()
      multiplayer.updateSavedMissionList()
      menus.show('replay-game')
    })
    $('#replay-game-menu-div .load-button').click(function () {
      var replayIndex = $('#replay-game-menu-div .mission-list').prop('selectedIndex')
      if (replayIndex > -1) {
        var savedGames = []
        var savedGamesString = localStorage.savedGames
        if (savedGamesString) {
          savedGames = JSON.parse(savedGamesString)
        }
        if (replayIndex < savedGames.length) {
          singleplayer.loadMission(replayIndex, true)
        } else {
          multiplayer.loadMultiplayerReplay(replayIndex - savedGames.length)
        }
      } else {
        menus.showMessageBox('Nothing Selected', 'Please select a saved game to replay')
      }
    })
    $('#replay-game-menu-div .cancel-button').click(function () {
      menus.show('game-type')
    })
    $('#replay-game-menu-div .save-button').click(function () {
      var replayIndex = $('#replay-game-menu-div .mission-list').prop('selectedIndex')
      if (replayIndex > -1) {
        var savedGames = []
        var savedGamesString = localStorage.savedGames
        if (savedGamesString) {
          savedGames = JSON.parse(savedGamesString)
        }
        var savedGame
        if (replayIndex < savedGames.length) {
          savedGame = JSON.stringify(savedGames[replayIndex])
        } else {
          savedGame = localStorage.lastMultiplayerGame
        }
        window.location = 'data:application/x-json;base64,' + btoa(savedGame)
      } else {
        menus.showMessageBox('Nothing Selected', 'Please select a game to save')
      }
    })
    $('#select-campaign-menu-div .gdi-campaign').click(function () {
      singleplayer.beginCampaign('gdi')
      sounds.stopStruggle()
    })
    $('#select-campaign-menu-div .nod-campaign').click(function () {
      singleplayer.beginCampaign('nod')
      sounds.stopStruggle()
    })
    $('#multiplayer-game-options-menu-div .resume-game-button').click(menus.hide)
    $('#multiplayer-game-options-menu-div .sound-controls-button').click(function () {
      menus.show('sound-controls')
    })
    $('#multiplayer-game-options-menu-div .abort-game-button').click(multiplayer.surrender)
    $('#singleplayer-game-options-menu-div .resume-mission-button').click(singleplayer.resumeLevel)
    $('#singleplayer-game-options-menu-div .abort-mission-button').click(function () {
      menus.show('abort-mission')
    })
    $('#abort-mission-menu-div .yes-button').click(function () {
      sounds.play('battle_control_terminated')
      singleplayer.exitLevel()
    })
    $('#abort-mission-menu-div .restart-button').click(function () {
      menus.hide()
      sounds.stopMusic()
      game.reset()
      singleplayer.loadLevel()
    })
    $('#abort-mission-menu-div .no-button').click(function () {
      menus.show('singleplayer-game-options')
    })
    $('#singleplayer-game-options-menu-div .restate-mission-button').click(singleplayer.restateMission)
    $('#restate-mission-menu-div .options-button').click(function () {
      menus.show('singleplayer-game-options')
    })
    $('#restate-mission-menu-div .video-button').click(function () {
      if (maps.currentMapData.videos && maps.currentMapData.videos.briefing) {
        menus.hide()
        videos.play(maps.currentMapData.videos.briefing, singleplayer.restateMission)
      }
    })
    $('#singleplayer-game-options-menu-div .game-controls-button').click(function () {
      menus.show('game-controls')
    })
    $('#game-controls-menu-div .visual-controls-button').click(function () {
      menus.notYetImplemented('Visual Controls')
    })
    $('#game-controls-menu-div .sound-controls-button').click(function () {
      menus.show('sound-controls')
    })
    $('#sound-controls-menu-div .musicvolume').noUiSlider('init', {
      handles: 1,
      scale: [0, 10],
      connect: true,
      step: 1,
      start: 10,
      change: function () {
        var value = $(this).noUiSlider('value')[1]
        sounds.setMusicVoume(value / 10)
      }
    })
    $('#sound-controls-menu-div .soundvolume').noUiSlider('init', {
      handles: 1,
      scale: [0, 10],
      start: 10,
      change: function () {
        var value = $(this).noUiSlider('value')[1]
        sounds.setAudioVoume(value / 10)
      }
    })
    $('#sound-controls-menu-div .stop-button').click(function () {
      sounds.stopMusic()
    })
    $('#sound-controls-menu-div .play-button').click(function () {
      var selectedSong = $('#sound-controls-menu-div .music-tracks-list').prop('selectedIndex')
      sounds.playMusic(selectedSong)
    })
    $('#sound-controls-menu-div .shuffle-button').click(function () {
      sounds.toggleShuffle()
      $('#sound-controls-menu-div .shuffle-button').val(sounds.shuffle ? 'On' : 'Off')
    })
    $('#sound-controls-menu-div .repeat-button').click(function () {
      sounds.toggleRepeat()
      $('#sound-controls-menu-div .repeat-button').val(sounds.repeat ? 'On' : 'Off')
    })
    $('#sound-controls-menu-div .options-button').click(function () {
      if (game.type == 'multiplayer') {
        menus.show('multiplayer-game-options')
      } else {
        menus.show('singleplayer-game-options')
      }
    })
    $('#game-controls-menu-div .options-button').click(function () {
      if (game.type == 'multiplayer') {
        menus.show('multiplayer-game-options')
      } else {
        menus.show('singleplayer-game-options')
      }
    })
    $('#start-network-game-menu-div .gamespeed').noUiSlider('init', {
      handles: 1,
      scale: [0, 6],
      connect: false,
      step: 1,
      start: 2,
      change: function () {
        var value = $(this).noUiSlider('value')[0]
        multiplayer.gameSpeed = value * 0.25 + 0.5
      }
    })
    $('#game-controls-menu-div .gamespeed').noUiSlider('init', {
      handles: 1,
      scale: [0, 6],
      connect: false,
      step: 1,
      start: 2,
      change: function () {
        var value = $(this).noUiSlider('value')[0]
        singleplayer.gameSpeed = value * 0.25 + 0.5
      }
    })
    $('#game-controls-menu-div .scrollspeed').noUiSlider('init', {
      handles: 1,
      scale: [0, 6],
      step: 1,
      start: 2,
      change: function () {
        var value = $(this).noUiSlider('value')[1]
        game.scrollSpeed = value * 0.25 + 0.5
      }
    })
    $('#singleplayer-game-options-menu-div .save-mission-button').click(function () {
      singleplayer.updateSavedMissionList()
      menus.show('save-mission')
      $('.mission-name').focus()
    })
    $('#save-mission-menu-div .mission-list').change(function () {
      if ($('#save-mission-menu-div .mission-list').prop('selectedIndex') > 0) {
        $('#save-mission-menu-div .mission-name').val($('#save-mission-menu-div .mission-list option:selected').html())
      }
      $('#save-mission-menu-div .mission-name').focus()
    })
    $('#save-mission-menu-div .save-button').click(function () {
      menus.notYetImplemented('Save Mission')
      singleplayer.saveMission($('#save-mission-menu-div .mission-list').prop('selectedIndex'), $('#save-mission-menu-div .mission-name').val())
    })
    $('#save-mission-menu-div .cancel-button').click(function () {
      menus.show('singleplayer-game-options')
    })
    $('#singleplayer-game-options-menu-div .delete-mission-button').click(function () {
      singleplayer.updateSavedMissionList()
      menus.show('delete-mission')
    })
    $('#delete-mission-menu-div .delete-button').click(function () {
      singleplayer.deleteMission($('#delete-mission-menu-div .mission-list').prop('selectedIndex'))
    })
    $('#delete-mission-menu-div .cancel-button').click(function () {
      menus.show('singleplayer-game-options')
    })
    $('#join-network-game-menu-div .join-multiplayer-button').click(multiplayer.joinExistingGame)
    $('#join-network-game-menu-div .cancel-multiplayer-button').click(multiplayer.cancel)
    $('#join-network-game-menu-div .new-multiplayer-button').click(multiplayer.createNewGame)
    $('#join-network-game-menu-div .games-list').change(multiplayer.selectGame)
    var sendMessage = function (container) {
      if (container == '#join-network-game-menu-div') {
        multiplayer.sendMessageToLobby($(container + ' .input-message').val())
      } else {
        multiplayer.sendMessageToPlayers($(container + ' .input-message').val())
      }
      $(container + ' .input-message').val('')
      $(container + ' .input-message').focus()
    }
    $('#joined-network-game-menu-div .input-message').keydown(function (ev) {
      if (ev.which == 13 && this.value != '') {
        sendMessage('#joined-network-game-menu-div')
      }
    })
    $('#join-network-game-menu-div .input-message').keydown(function (ev) {
      if (ev.which == 13 && this.value != '') {
        sendMessage('#join-network-game-menu-div')
      }
    })
    $('#start-network-game-menu-div .input-message').keydown(function (ev) {
      if (ev.which == 13 && this.value != '') {
        sendMessage('#start-network-game-menu-div')
      }
    })
    $('#joined-network-game-menu-div .send-message-button').click(function () {
      sendMessage('#joined-network-game-menu-div')
    })
    $('#join-network-game-menu-div .send-message-button').click(function () {
      sendMessage('#join-network-game-menu-div')
    })
    $('#start-network-game-menu-div .send-message-button').click(function () {
      sendMessage('#start-network-game-menu-div')
    })
    $('#start-network-game-menu-div .cancel-multiplayer-button').click(multiplayer.cancelNewGame)
    $('#start-network-game-menu-div .reject-player-button').click(multiplayer.rejectPlayer)
    $('#joined-network-game-menu-div .cancel-multiplayer-button').click(multiplayer.cancelJoinedGame)
    $('#start-network-game-menu-div .start-multiplayer-button').click(function () {
      var credits = parseInt($('#start-network-game-menu-div .starting-credits').val(), 10)
      if (isNaN(credits) || credits < 0) {
        menus.showMessageBox('Invalid Starting Credits', 'Please enter a valid value for starting credits.', function () {
          $('#start-network-game-menu-div .starting-credits').focus()
        })
        return
      }
      var level = $('#start-network-game-menu-div .scenarios').val()
      multiplayer.startNewGame({
        credits: credits,
        level: level,
        gameSpeed: multiplayer.gameSpeed
      })
    })
  },
  reposition: function (containerWidth, containerHeight) {
    $('#select-campaign-menu-div').width(containerWidth).height(containerHeight)
    $('.game-menu').each(function (index, element) {
      var $menu = $(this)
      $menu.css({
        top: Math.round((containerHeight - $menu.height()) / 2),
        left: Math.round((containerWidth - $menu.width()) / 2)
      })
    })
  },
  show: function (menuName) {
    if (menuName === 'game-type') {
      game.reset()
    }
    menus.hide()
    $('#menu-container').show()
    $('#menu-container').css('background', menus.list[menuName].background)
    $('#' + menuName + '-menu-div').show()
    if (menus.list[menuName].onshow) {
      menus.list[menuName].onshow()
    }
  },
  isActive: function (menuName) {
    return $('#' + menuName + '-menu-div').is(':visible')
  },
  hide: function () {
    $('#menu-container').css('background', 'none')
    $('#menu-container').hide()
    $('.game-menu').hide()
    $('#message-box-menu-div').hide()
    $('#message-box-container').hide()
  },
  showMessageBox: function (title, content, onclickhandler) {
    $('#message-box-container').show()
    $('#message-box-container').css('background', menus.list['message-box'].background)
    $('#message-box-menu-div').show()
    $('#message-box-menu-div .message-box-title').html(title)
    $('#message-box-menu-div .message-box-content').html(content)
    $('#message-box-menu-div .message-box-ok').unbind('click').click(function () {
      $('#message-box-menu-div').hide()
      $('#message-box-container').hide()
      if (onclickhandler) {
        onclickhandler()
      }
    })
  }
}
!(function ($) {
  $.fn.noUiSlider = function (method, options) {
    function neg (a) {
      return a < 0
    }

    function abs (a) {
      return Math.abs(a)
    }

    function roundTo (a, b) {
      return Math.round(a / b) * b
    }

    function dup (a) {
      return jQuery.extend(true, {}, a)
    }
    var defaults, methods, helpers, options = options || [],
      functions, touch = 'ontouchstart' in document.documentElement
    defaults = {
      handles: 2,
      connect: true,
      scale: [0, 100],
      start: [25, 75],
      to: 0,
      handle: 0,
      change: '',
      end: '',
      step: false,
      save: false,
      click: true
    }
    helpers = {
      scale: function (a, b, c) {
        var d = b[0],
          e = b[1]
        if (neg(d)) {
          a = a + abs(d)
          e = e + abs(d)
        } else {
          a = a - d
          e = e - d
        }
        return a * c / e
      },
      deScale: function (a, b, c) {
        var d = b[0],
          e = b[1]
        e = neg(d) ? e + abs(d) : e - d
        return a * e / c + d
      },
      connect: function (api) {
        if (api.connect) {
          if (api.handles.length > 1) {
            api.connect.css({
              left: api.low.left(),
              right: api.slider.innerWidth() - api.up.left()
            })
          } else {
            api.low ? api.connect.css({
              left: api.low.left(),
              right: 0
            }) : api.connect.css({
              left: 0,
              right: api.slider.innerWidth() - api.up.left()
            })
          }
        }
      },
      left: function () {
        return parseFloat($(this).css('left'))
      },
      call: function (f, t, n) {
        if (typeof f === 'function') {
          f.call(t, n)
        }
      },
      bounce: function (api, n, c, handle) {
        var go = false
        if (handle.is(api.up)) {
          if (api.low && n < api.low.left()) {
            n = api.low.left()
            go = true
          }
        } else {
          if (api.up && n > api.up.left()) {
            n = api.up.left()
            go = true
          }
        }
        if (n > api.slider.innerWidth()) {
          n = api.slider.innerWidth()
          go = true
        } else if (n < 0) {
          n = 0
          go = true
        }
        return [n, go]
      }
    }
    methods = {
      init: function () {
        return this.each(function () {
          var s, slider, api
          slider = $(this).css('position', 'relative')
          api = new Object()
          api.options = $.extend(defaults, options)
          s = api.options
          typeof s.start === 'object' ? 1 : s.start = [s.start]
          api.slider = slider
          api.low = $('<div class="noUi-handle noUi-lowerHandle"><div></div></div>')
          api.up = $('<div class="noUi-handle noUi-upperHandle"><div></div></div>')
          api.connect = $('<div class="noUi-midBar"></div>')
          s.connect ? api.connect.appendTo(api.slider) : api.connect = false
          if (s.knobs) {
            s.handles = s.knobs
          }
          if (s.handles === 1) {
            if (s.connect === true || s.connect === 'lower') {
              api.low = false
              api.up = api.up.appendTo(api.slider)
              api.handles = [api.up]
            } else if (s.connect === 'upper' || !s.connect) {
              api.low = api.low.prependTo(api.slider)
              api.up = false
              api.handles = [api.low]
            }
          } else {
            api.low = api.low.prependTo(api.slider)
            api.up = api.up.appendTo(api.slider)
            api.handles = [api.low, api.up]
          }
          if (api.low) {
            api.low.left = helpers.left
          }
          if (api.up) {
            api.up.left = helpers.left
          }
          api.slider.children().css('position', 'absolute')
          $.each(api.handles, function (index) {
            $(this).css({
              left: helpers.scale(s.start[index], api.options.scale, api.slider.innerWidth()),
              zIndex: index + 1
            }).children().bind(touch ? 'touchstart.noUi' : 'mousedown.noUi', functions.start)
          })
          if (s.click) {
            api.slider.click(functions.click).find('*:not(.noUi-midBar)').click(functions.flse)
          }
          helpers.connect(api)
          api.options = s
          api.slider.data('api', api)
        })
      },
      move: function () {
        var api, bounce, to, handle, scale
        api = dup($(this).data('api'))
        api.options = $.extend(api.options, options)
        if (api.options.knob) {
          api.options.handle = api.options.knob
        }
        handle = api.options.handle
        handle = api.handles[handle == 'lower' || handle == 0 || typeof handle === 'undefined' ? 0 : 1]
        bounce = helpers.bounce(api, helpers.scale(api.options.to, api.options.scale, api.slider.innerWidth()), handle.left(), handle)
        handle.css('left', bounce[0])
        if (handle.is(api.up) && handle.left() == 0 || handle.is(api.low) && handle.left() == api.slider.innerWidth()) {
          handle.css('zIndex', parseInt(handle.css('zIndex')) + 2)
        }
        if (options.save === true) {
          api.options.scale = options.scale
          $(this).data('api', api)
        }
        helpers.connect(api)
        helpers.call(api.options.change, api.slider, 'move')
        helpers.call(api.options.end, api.slider, 'move')
      },
      value: function () {
        var val1, val2, api
        api = dup($(this).data('api'))
        api.options = $.extend(api.options, options)
        val1 = api.low ? Math.round(helpers.deScale(api.low.left(), api.options.scale, api.slider.innerWidth())) : false
        val2 = api.up ? Math.round(helpers.deScale(api.up.left(), api.options.scale, api.slider.innerWidth())) : false
        if (options.save) {
          api.options.scale = options.scale
          $(this).data('api', api)
        }
        return [val1, val2]
      },
      api: function () {
        return $(this).data('api')
      },
      disable: function () {
        return this.each(function () {
          $(this).addClass('disabled')
        })
      },
      enable: function () {
        return this.each(function () {
          $(this).removeClass('disabled')
        })
      }
    }, functions = {
      start: function (e) {
        if (!$(this).parent().parent().hasClass('disabled')) {
          e.preventDefault()
          $('body').bind('selectstart.noUi', functions.flse)
          $(this).addClass('noUi-activeHandle')
          $(document).bind(touch ? 'touchmove.noUi' : 'mousemove.noUi', functions.move)
          touch ? $(this).bind('touchend.noUi', functions.end) : $(document).bind('mouseup.noUi', functions.end)
        }
      },
      move: function (e) {
        var a, b, h, api, go = false,
          handle, bounce
        h = $('.noUi-activeHandle')
        api = h.parent().parent().data('api')
        handle = h.parent().is(api.low) ? api.low : api.up
        a = e.pageX - Math.round(api.slider.offset().left)
        if (isNaN(a)) {
          a = e.originalEvent.touches[0].pageX - Math.round(api.slider.offset().left)
        }
        b = handle.left()
        bounce = helpers.bounce(api, a, b, handle)
        a = bounce[0]
        go = bounce[1]
        if (api.options.step && !go) {
          var v1 = api.options.scale[0],
            v2 = api.options.scale[1]
          if (neg(v2)) {
            v2 = abs(v1 - v2)
            v1 = 0
          }
          v2 = v2 + -1 * v1
          var con = helpers.scale(api.options.step, [0, v2], api.slider.innerWidth())
          if (Math.abs(b - a) >= con) {
            a = a < b ? b - con : b + con
            go = true
          }
        } else {
          go = true
        }
        if (a === b) {
          go = false
        }
        if (go) {
          handle.css('left', a)
          if (handle.is(api.up) && handle.left() == 0 || handle.is(api.low) && handle.left() == api.slider.innerWidth()) {
            handle.css('zIndex', parseInt(handle.css('zIndex')) + 2)
          }
          helpers.connect(api)
          helpers.call(api.options.change, api.slider, 'slide')
        }
      },
      end: function () {
        var handle, api
        handle = $('.noUi-activeHandle')
        api = handle.parent().parent().data('api')
        $(document).add('body').add(handle.removeClass('noUi-activeHandle').parent()).unbind('.noUi')
        helpers.call(api.options.end, api.slider, 'slide')
      },
      click: function (e) {
        if (!$(this).hasClass('disabled')) {
          var api = $(this).data('api')
          var s = api.options
          var c = e.pageX - api.slider.offset().left
          c = s.step ? roundTo(c, helpers.scale(s.step, s.scale, api.slider.innerWidth())) : c
          if (api.low && api.up) {
            c < (api.low.left() + api.up.left()) / 2 ? api.low.css('left', c) : api.up.css('left', c)
          } else {
            api.handles[0].css('left', c)
          }
          helpers.connect(api)
          helpers.call(s.change, api.slider, 'click')
          helpers.call(s.end, api.slider, 'click')
        }
      },
      flse: function () {
        return false
      }
    }
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments)
    } else {
      $.error('No such method: ' + method)
    }
  }
}(jQuery))
var mouse = {
  cursors: [],
  cursorCount: 0,
  load: function () {
    mouse.canvas = $('.mousecanvas')[0]
    mouse.context = mouse.canvas.getContext('2d')
    mouse.spriteImage = loader.loadImage('images/mouse.png')
    mouse.blankCursor = loader.loadImage('images/blank.gif')
    mouse.defaultCursor = loader.loadImage('images/default-cursor.gif')
    mouse.loadCursor('default')
    mouse.loadCursor('pan_top', 15, 0)
    mouse.loadCursor('pan_top_right', 30, 0)
    mouse.loadCursor('pan_right', 30, 12)
    mouse.loadCursor('pan_bottom_right', 30, 24)
    mouse.loadCursor('pan_bottom', 15, 24)
    mouse.loadCursor('pan_bottom_left', 0, 24)
    mouse.loadCursor('pan_left', 0, 12)
    mouse.loadCursor('pan_top_left', 0, 0)
    mouse.loadCursor('no_default')
    mouse.loadCursor('move', 15, 12)
    mouse.loadCursor('no_move', 15, 12)
    mouse.loadCursor('select', 15, 12, 6)
    mouse.loadCursor('attack', 15, 12, 8)
    mouse.loadCursor('unknown')
    mouse.loadCursor('unknown')
    mouse.loadCursor('unknown')
    mouse.loadCursor('repair', 15, 0, 24)
    mouse.loadCursor('build_command', 15, 12, 9)
    mouse.loadCursor('sell', 15, 12, 24)
    mouse.loadCursor('unknown')
    mouse.loadCursor('unknown')
    mouse.loadCursor('blue_attack', 15, 12, 8)
    mouse.loadCursor('nuke_attack', 15, 12, 7)
    mouse.loadCursor('green_attack', 15, 12, 16)
    mouse.loadCursor('load', 15, 12, 3, 2)
    mouse.loadCursor('detonate', 15, 12, 3)
    mouse.loadCursor('no_sell', 15, 12)
    mouse.loadCursor('no_repair', 15, 0)
    mouse.loadCursor('little_detonate', 15, 12, 3)
    mouse.loadCursor('no_pan_top', 15, 0)
    mouse.loadCursor('no_pan_top_right', 30, 0)
    mouse.loadCursor('no_pan_right', 30, 12)
    mouse.loadCursor('no_pan_bottom_right', 30, 24)
    mouse.loadCursor('no_pan_bottom', 15, 24)
    mouse.loadCursor('no_pan_bottom_left', 0, 24)
    mouse.loadCursor('no_pan_left', 0, 12)
    mouse.loadCursor('no_pan_top_left', 0, 0)
    mouse.loadCursor('unknown')
    mouse.loadCursor('unknown')
    mouse.loadCursor('another_attack', 15, 12, 8)
    mouse.loadCursor('another_load', 15, 12, 3, 2)
    mouse.loadCursor('unknown')
    mouse.loadCursor('unknown')
    mouse.loadCursor('unknown')
    mouse.loadCursor('unknown')
    mouse.loadCursor('another_sell', 15, 12, 24)
    mouse.cursor = mouse.cursors['default']
    mouse.listenEvents()
  },
  loadCursor: function (name, x, y, imageCount, cursorSpeed) {
    if (!x && !y) {
      x = 0
      y = 0
    }
    if (!cursorSpeed) {
      cursorSpeed = 1
    }
    if (!imageCount) {
      imageCount = 1
    }
    this.cursors[name] = {
      x: x,
      y: y,
      name: name,
      count: imageCount,
      spriteOffset: this.cursorCount,
      cursorSpeed: cursorSpeed
    }
    this.cursorCount += imageCount
  },
  click: function (ev, rightClick) {
    if (!game.running) {
      return
    }
    if (mouse.y <= game.viewportTop && mouse.y > game.viewportTop - 15) {
      if (mouse.x >= 0 && mouse.x < 160) {
        if (game.replay) {} else {
          if (game.type == 'singleplayer') {
            singleplayer.gameOptions()
          } else {
            multiplayer.gameOptions()
          }
        }
      } else if (mouse.x >= 320 && mouse.x < 480) {} else if (mouse.x >= 480 && mouse.x < 640) {
        sidebar.visible = !sidebar.visible
        game.refreshBackground = true
      }
    } else if (mouse.y >= game.viewportTop && mouse.y <= game.viewportTop + game.viewportHeight) {
      if (sidebar.visible && mouse.x > sidebar.left) {
        sidebar.click(ev, rightClick)
      } else {
        game.click(ev, rightClick)
      }
    }
  },
  listenEvents: function () {
    var $mouseCanvas = $('.mousecanvas')
    $mouseCanvas.mousemove(function (ev) {
      var offset = $mouseCanvas.offset()
      mouse.x = Math.round((ev.pageX - offset.left) * game.scaleFactor)
      mouse.y = Math.round((ev.pageY - offset.top) * game.scaleFactor)
      mouse.gameX = mouse.x - game.viewportAdjustX
      mouse.gameY = mouse.y - game.viewportAdjustY
      mouse.gridX = Math.floor(mouse.gameX / game.gridSize)
      mouse.gridY = Math.floor(mouse.gameY / game.gridSize)
      if (mouse.buttonPressed) {
        if (game.running && (Math.abs(mouse.dragX - mouse.gameX) > 4 || Math.abs(mouse.dragY - mouse.gameY) > 4)) {
          mouse.dragSelect = true
        }
      } else {
        mouse.dragSelect = false
      }
      mouse.draw()
    })
    $mouseCanvas.click(function (ev) {
      mouse.click(ev, false)
      mouse.dragSelect = false
      return false
    })
    $mouseCanvas.mousedown(function (ev) {
      if (ev.which == 1) {
        mouse.buttonPressed = true
        mouse.dragX = mouse.gameX
        mouse.dragY = mouse.gameY
        ev.preventDefault()
      }
      return false
    })
    $mouseCanvas.bind('contextmenu', function (ev) {
      mouse.click(ev, true)
      return false
    })
    $mouseCanvas.mouseup(function (ev) {
      if (ev.which == 1) {
        if (mouse.dragSelect && !game.showMessage) {
          if (!ev.shiftKey) {
            game.clearSelection()
          }
          var x1 = Math.min(mouse.gameX, mouse.dragX)
          var y1 = Math.min(mouse.gameY, mouse.dragY)
          var x2 = Math.max(mouse.gameX, mouse.dragX)
          var y2 = Math.max(mouse.gameY, mouse.dragY)
          var lastUnit
          for (var i = game.items.length - 1; i >= 0; i--) {
            var unit = game.items[i]
            if (unit.type != 'buildings' && unit.type != 'turrets' && !unit.unselectable && unit.player == game.player && x1 <= unit.x * game.gridSize && x2 >= unit.x * game.gridSize && y1 <= (unit.y - unit.z) * game.gridSize && y2 >= (unit.y - unit.z) * game.gridSize) {
              game.selectItem(unit, ev.shiftKey, true)
              lastUnit = unit
            }
          }
          if (lastUnit && !game.replay) {
            if (game.selectedCommandos.length > 0) {
              sounds.play('commando_select')
            } else {
              sounds.play(lastUnit.type + '_select')
            }
          }
        }
        mouse.buttonPressed = false
      }
      return false
    })
    $mouseCanvas.mouseleave(function (ev) {
      mouse.insideCanvas = false
      mouse.draw()
    })
    $mouseCanvas.mouseenter(function (ev) {
      mouse.buttonPressed = false
      mouse.insideCanvas = true
    })
    $(document).keydown(function (ev) {
      game.keyPressed(ev)
    })
    $(document).keyup(function (ev) {
      game.keyReleased(ev)
    })
  },
  cursorLoop: 0,
  underMouse: function () {
    if (mouse.y < game.viewportTop || mouse.y > game.viewportTop + game.viewportHeight || fog.isPointOverFog(mouse.gameX, mouse.gameY)) {
      return false
    }
    var selection = false
    for (var i = game.items.length - 1; i >= 0; i--) {
      var item = game.items[i]
      if (item.type == 'buildings' || item.type == 'turrets' || item.type == 'walls' || item.type == 'tiberium') {
        if (item.x <= mouse.gameX / game.gridSize && item.x >= (mouse.gameX - item.pixelWidth) / game.gridSize && item.y <= mouse.gameY / game.gridSize && item.y >= (mouse.gameY - item.pixelHeight) / game.gridSize) {
          if (item.z > -1) {
            return item
          } else {
            selection = item
          }
        }
      } else {
        if (item.lifeCode != 'dead' && item.type != 'trees' && Math.pow(item.x - mouse.gameX / game.gridSize, 2) + Math.pow(item.y - item.z - mouse.gameY / game.gridSize, 2) < Math.pow((item.softCollisionRadius + 4) / game.gridSize, 2)) {
          if (!item.cloaked || item.player == game.player) {
            return item
          }
        }
      }
    }
    return selection
  },
  setCursor: function () {
    mouse.cursor = mouse.cursors['default']
    mouse.tooltip = undefined
    this.objectUnderMouse = undefined
    if (!game.running) {
      return
    }
    if (mouse.y < game.viewportTop) {
      mouse.cursor = mouse.cursors['default']
    } else if (mouse.y >= game.viewportTop && mouse.y <= game.viewportTop + game.viewportHeight) {
      this.objectUnderMouse = mouse.underMouse()
      if (mouse.panDirection && mouse.panDirection !== '') {
        mouse.cursor = mouse.cursors[mouse.panDirection]
      } else if (sidebar.visible && mouse.x > sidebar.left) {
        mouse.cursor = mouse.cursors['default']
        var button = sidebar.hoveredButton()
        if (game.running && button) {
          var tooltipName = button.label
          var tooltipCost = '$' + button.cost
          mouse.tooltip = button.type != 'special' ? [tooltipName, tooltipCost] : [tooltipName]
        }
      } else if (sidebar.deployMode) {
        if (sidebar.deploySpecial) {
          switch (sidebar.deploySpecial.name) {
            case 'nuclear-strike':
              mouse.cursor = mouse.cursors['nuke_attack']
              break
            case 'ion-cannon':
              mouse.cursor = mouse.cursors['green_attack']
              break
            case 'air-strike':
              mouse.cursor = mouse.cursors['blue_attack']
              break
          }
        }
      } else if (sidebar.repairMode) {
        if (this.objectUnderMouse && this.objectUnderMouse.player == game.player && (this.objectUnderMouse.type === 'buildings' || this.objectUnderMouse.type === 'turrets') && this.objectUnderMouse.life < this.objectUnderMouse.hitPoints) {
          mouse.cursor = mouse.cursors['repair']
        } else {
          mouse.cursor = mouse.cursors['no_repair']
        }
      } else if (sidebar.sellMode) {
        if (this.objectUnderMouse && this.objectUnderMouse.player == game.player && (this.objectUnderMouse.type == 'buildings' || this.objectUnderMouse.type == 'turrets')) {
          this.cursor = this.cursors['sell']
        } else {
          this.cursor = this.cursors['no_sell']
        }
      } else {
        if (this.objectUnderMouse && game.selectedUnits.length == 1 && this.objectUnderMouse.selected && this.objectUnderMouse.name == 'mcv' && this.objectUnderMouse.player == game.player && !game.replay) {
          if (this.objectUnderMouse.canBuildHere) {
            mouse.cursor = mouse.cursors['build_command']
          } else {
            mouse.cursor = mouse.cursors['default']
          }
        } else if (this.objectUnderMouse && game.selectedUnits.length == 1 && this.objectUnderMouse.selected && this.objectUnderMouse.name == 'apc' && this.objectUnderMouse.player == game.player && !game.replay) {
          if (this.objectUnderMouse.cargo.length > 0) {
            mouse.cursor = mouse.cursors['build_command']
          } else {
            mouse.cursor = mouse.cursors['default']
          }
        } else if (this.objectUnderMouse && game.selectedUnits.length == 1 && this.objectUnderMouse.selected && this.objectUnderMouse.name == 'chinook' && this.objectUnderMouse.player == game.player && !game.replay) {
          if (this.objectUnderMouse.cargo.length > 0 && this.objectUnderMouse.z == 0) {
            mouse.cursor = mouse.cursors['build_command']
          } else {
            mouse.cursor = mouse.cursors['default']
          }
        } else if (this.objectUnderMouse && game.selectedInfantry.length > 0 && this.objectUnderMouse.player == game.player && this.objectUnderMouse.name == 'apc' && this.objectUnderMouse.cargo.length < this.objectUnderMouse.maxCargo && !game.replay) {
          mouse.cursor = mouse.cursors['load']
        } else if (this.objectUnderMouse && game.selectedInfantry.length > 0 && this.objectUnderMouse.player == game.player && this.objectUnderMouse.name == 'chinook' && this.objectUnderMouse.cargo.length < this.objectUnderMouse.maxCargo && !game.replay) {
          mouse.cursor = mouse.cursors['load']
        } else if (this.objectUnderMouse && game.selectedAircraft.length > 0 && this.objectUnderMouse.player == game.player && this.objectUnderMouse.name == 'helipad' && !game.replay) {
          mouse.cursor = mouse.cursors['load']
        } else if (this.objectUnderMouse && game.selectedHarvesters.length > 0 && this.objectUnderMouse.name == 'tiberium' && !game.replay) {
          mouse.cursor = mouse.cursors['attack']
        } else if (this.objectUnderMouse && game.selectedHarvesters.length > 0 && this.objectUnderMouse.player == game.player && this.objectUnderMouse.name == 'refinery' && !game.replay) {
          mouse.cursor = mouse.cursors['load']
        } else if (this.objectUnderMouse && game.selectedVehicles.length > 0 && this.objectUnderMouse.player == game.player && this.objectUnderMouse.name == 'repair-facility' && !game.replay) {
          mouse.cursor = mouse.cursors['load']
        } else if (this.objectUnderMouse && game.selectedCommandos.length > 0 && (this.objectUnderMouse.type == 'buildings' || this.objectUnderMouse.type == 'turrets') && this.objectUnderMouse.player != game.player && !game.replay) {
          mouse.cursor = mouse.cursors['detonate']
        } else if (this.objectUnderMouse && game.selectedEngineers.length > 0 && this.objectUnderMouse.type == 'buildings' && this.objectUnderMouse.player != game.player && !game.replay) {
          mouse.cursor = mouse.cursors['load']
        } else if (this.objectUnderMouse && game.selectedAttackers.length > 0 && this.objectUnderMouse.player != game.player && !this.objectUnderMouse.unattackable && !game.replay) {
          mouse.cursor = mouse.cursors['attack']
        } else if (this.objectUnderMouse && !this.objectUnderMouse.unselectable && !this.objectUnderMouse.selected) {
          mouse.cursor = mouse.cursors['select']
        } else if (fog.isPointOverFog(mouse.gameX, mouse.gameY) && game.selectedAircraft.length > 0) {
          mouse.cursor = mouse.cursors['no_move']
        } else if (game.selectedUnits.length > 0 && !game.replay) {
          try {
            if (!game.foggedObstructionGrid[game.player][Math.floor(mouse.gridY)][Math.floor(mouse.gridX)]) {
              mouse.cursor = mouse.cursors['move']
            } else {
              mouse.cursor = mouse.cursors['no_move']
            }
          } catch (x) {
            mouse.cursor = mouse.cursors['no_move']
          }
        } else {
          mouse.cursor = mouse.cursors['default']
        }
      }
    }
    mouse.cursorLoop++
    if (mouse.cursorLoop >= mouse.cursor.cursorSpeed * mouse.cursor.count) {
      mouse.cursorLoop = 0
    }
    mouse.draw()
  },
  draw: function () {
    mouse.context.clearRect(0, 0, game.canvasWidth, game.canvasHeight)
    if (mouse.insideCanvas) {
      var imageNumber = mouse.cursor.spriteOffset + Math.floor(mouse.cursorLoop / mouse.cursor.cursorSpeed)
      mouse.context.drawImage(mouse.spriteImage, 30 * imageNumber, 0, 30, 24, mouse.x - mouse.cursor.x, mouse.y - mouse.cursor.y, 30, 24)
      if (this.dragSelect) {
        var x = Math.min(this.gameX, this.dragX)
        var y = Math.min(this.gameY, this.dragY)
        var width = Math.abs(this.gameX - this.dragX)
        var height = Math.abs(this.gameY - this.dragY)
        mouse.context.strokeStyle = 'white'
        mouse.context.strokeRect(x + game.viewportAdjustX, y + game.viewportAdjustY, width, height)
      }
      if (this.tooltip) {
        var tooltipHeight = 14 * this.tooltip.length + 3
        var tooltipWidth = this.tooltip[0].length * 6
        var x = Math.round(this.x)
        if (x + tooltipWidth > sidebar.left + sidebar.width) {
          x = sidebar.width + sidebar.left - tooltipWidth
        }
        var y = Math.round(this.y + 16)
        mouse.context.fillStyle = 'black'
        mouse.context.fillRect(x, y, tooltipWidth, tooltipHeight)
        mouse.context.strokeStyle = 'darkgreen'
        mouse.context.strokeRect(x, y, tooltipWidth, tooltipHeight)
        mouse.context.fillStyle = 'darkgreen'
        mouse.context.font = '12px Command'
        for (var i = 0; i < this.tooltip.length; i++) {
          mouse.context.fillText(this.tooltip[i], x + 4, y + 14 + i * 14)
        }
      }
    }
  },
  panDirection: '',
  panningThreshold: 24,
  panningVelocity: 12,
  handlePanning: function () {
    var panDirection = ''
    game.viewportDeltaX = 0
    game.viewportDeltaY = 0
    if (mouse.insideCanvas || game.upKeyPressed || game.downKeyPressed || game.leftKeyPressed || game.rightKeyPressed) {
      if (game.upKeyPressed || mouse.y <= game.viewportTop + mouse.panningThreshold && mouse.y >= game.viewportTop) {
        game.viewportDeltaY = -mouse.panningVelocity * game.scrollSpeed
        panDirection += '_top'
      } else if (game.downKeyPressed || mouse.y >= game.viewportTop + game.viewportHeight - mouse.panningThreshold && mouse.y <= game.viewportTop + game.viewportHeight && !(sidebar.visible && mouse.x >= 500 && mouse.x <= 632 && mouse.y - sidebar.top >= 455 && mouse.y - sidebar.top <= 480)) {
        game.viewportDeltaY = mouse.panningVelocity * game.scrollSpeed
        panDirection += '_bottom'
      } else {
        game.viewportDeltaY = 0
        panDirection += ''
      }
      if (game.leftKeyPressed || mouse.x < mouse.panningThreshold && mouse.y >= game.viewportTop && mouse.y <= game.viewportTop + game.viewportHeight) {
        game.viewportDeltaX = -mouse.panningVelocity * game.scrollSpeed
        panDirection += '_left'
      } else if (game.rightKeyPressed || mouse.x > game.screenWidth - mouse.panningThreshold && mouse.y >= game.viewportTop && mouse.y <= game.viewportTop + game.viewportHeight) {
        game.viewportDeltaX = mouse.panningVelocity * game.scrollSpeed
        panDirection += '_right'
      } else {
        game.viewportDeltaX = 0
        panDirection += ''
      }
    }
    if (game.viewportX + game.viewportDeltaX < 0 || game.viewportX + game.viewportDeltaX + game.screenWidth + (sidebar.visible ? -sidebar.width : 0) > maps.currentMapImage.width) {
      game.viewportDeltaX = 0
    }
    if (!sidebar.visible && game.viewportX + game.screenWidth > maps.currentMapImage.width) {
      game.viewportX = maps.currentMapImage.width - game.screenWidth
      game.viewportDeltaX = 0
    }
    if (game.viewportY + game.viewportDeltaY < 0 || game.viewportY + game.viewportDeltaY + game.viewportHeight > maps.currentMapImage.height) {
      game.viewportDeltaY = 0
    }
    if (panDirection !== '') {
      if (game.viewportDeltaX === 0 && game.viewportDeltaY === 0) {
        panDirection = 'no_pan' + panDirection
      } else {
        panDirection = 'pan' + panDirection
      }
    }
    mouse.panDirection = panDirection
    game.viewportX += game.viewportDeltaX
    game.viewportY += game.viewportDeltaY
    if (game.viewportDeltaX || game.viewportDeltaY) {
      game.refreshBackground = true
    }
    game.viewportAdjustX = game.viewportLeft - game.viewportX
    game.viewportAdjustY = game.viewportTop - game.viewportY
  }
}
var AStar = (function () {
  function diagonalSuccessors ($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
    if ($N) {
      $E && !grid[N][E] && (result[i++] = {
        x: E,
        y: N
      })
      $W && !grid[N][W] && (result[i++] = {
        x: W,
        y: N
      })
    }
    if ($S) {
      $E && !grid[S][E] && (result[i++] = {
        x: E,
        y: S
      })
      $W && !grid[S][W] && (result[i++] = {
        x: W,
        y: S
      })
    }
    return result
  }

  function diagonalSuccessorsFree ($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
    $N = N > -1
    $S = S < rows
    $E = E < cols
    $W = W > -1
    if ($E) {
      $N && !grid[N][E] && (result[i++] = {
        x: E,
        y: N
      })
      $S && !grid[S][E] && (result[i++] = {
        x: E,
        y: S
      })
    }
    if ($W) {
      $N && !grid[N][W] && (result[i++] = {
        x: W,
        y: N
      })
      $S && !grid[S][W] && (result[i++] = {
        x: W,
        y: S
      })
    }
    return result
  }

  function nothingToDo ($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i) {
    return result
  }

  function successors (find, x, y, grid, rows, cols) {
    var N = y - 1,
      S = y + 1,
      E = x + 1,
      W = x - 1,
      $N = N > -1 && !grid[N][x],
      $S = S < rows && !grid[S][x],
      $E = E < cols && !grid[y][E],
      $W = W > -1 && !grid[y][W],
      result = [],
      i = 0
    $N && (result[i++] = {
      x: x,
      y: N
    })
    $E && (result[i++] = {
      x: E,
      y: y
    })
    $S && (result[i++] = {
      x: x,
      y: S
    })
    $W && (result[i++] = {
      x: W,
      y: y
    })
    return find($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, i)
  }

  function diagonal (start, end, f1, f2) {
    return f2(f1(start.x - end.x), f1(start.y - end.y))
  }

  function euclidean (start, end, f1, f2) {
    var x = start.x - end.x,
      y = start.y - end.y
    return f2(x * x + y * y)
  }

  function manhattan (start, end, f1, f2) {
    return f1(start.x - end.x) + f1(start.y - end.y)
  }

  function AStar (grid, start, end, f) {
    var cols = grid[0].length,
      rows = grid.length,
      limit = cols * rows,
      f1 = Math.abs,
      f2 = Math.max,
      list = {},
      result = [],
      open = [{
        x: start[0],
        y: start[1],
        f: 0,
        g: 0,
        v: start[0] + start[1] * cols
      }],
      length = 1,
      adj, distance, find, i, j, max, min, current, next
    end = {
      x: end[0],
      y: end[1],
      v: end[0] + end[1] * cols
    }
    switch (f) {
      case 'Diagonal':
        find = diagonalSuccessors
      case 'DiagonalFree':
        distance = diagonal
        break
      case 'Euclidean':
        find = diagonalSuccessors
      case 'EuclideanFree':
        f2 = Math.sqrt
        distance = euclidean
        break
      default:
        distance = manhattan
        find = nothingToDo
        break
    }
    find || (find = diagonalSuccessorsFree)
    do {
      max = limit
      min = 0
      for (i = 0; i < length; ++i) {
        if ((f = open[i].f) < max) {
          max = f
          min = i
        }
      }
      current = open.splice(min, 1)[0]
      if (current.v != end.v) {
        --length
        next = successors(find, current.x, current.y, grid, rows, cols)
        for (i = 0, j = next.length; i < j; ++i) {
          (adj = next[i]).p = current
          adj.f = adj.g = 0
          adj.v = adj.x + adj.y * cols
          if (!(adj.v in list)) {
            adj.f = (adj.g = current.g + distance(adj, current, f1, f2)) + distance(adj, end, f1, f2)
            open[length++] = adj
            list[adj.v] = 1
          }
        }
      } else {
        i = length = 0
        do {
          result[i++] = {
            x: current.x,
            y: current.y
          }
        } while (current = current.p)
        result.reverse()
      }
    } while (length)
    return result
  }
  return AStar
}())

function checkCollision () {
  var collisionObjects = []
  var movement = 1 * this.speed / game.gridSize / game.speedAdjustmentFactor
  var angleRadians = this.direction / this.directions * 2 * Math.PI
  var newX = this.x - roundFloating(movement * Math.sin(angleRadians))
  var newY = this.y - roundFloating(movement * Math.cos(angleRadians))
  for (var i = game.obstructionGrid.length - 1; i >= 0; i--) {
    if (Math.abs(i + 0.5 - newY) < 3) {
      for (var j = game.obstructionGrid[i].length - 1; j >= 0; j--) {
        if (game.obstructionGrid[i][j] && Math.abs(j - newX + 0.5) < 3) {
          if (Math.pow(j + 0.5 - newX, 2) + Math.pow(i + 0.5 - newY, 2) < Math.pow(this.hardCollisionRadius / game.gridSize + 0.5, 2)) {
            collisionObjects.push({
              collisionType: 'ultra-hard',
              withItem: {
                type: 'wall',
                x: j + 0.5,
                y: i + 0.5
              }
            })
          } else if (Math.pow(j + 0.5 - newX, 2) + Math.pow(i + 0.5 - newY, 2) < Math.pow(this.softCollisionRadius / game.gridSize + 0.5, 2)) {
            collisionObjects.push({
              collisionType: 'hard',
              withItem: {
                type: 'wall',
                x: j + 0.5,
                y: i + 0.5
              }
            })
          } else if (Math.pow(j + 0.5 - newX, 2) + Math.pow(i + 0.5 - newY, 2) < Math.pow(this.softCollisionRadius / game.gridSize + 0.7, 2)) {
            collisionObjects.push({
              collisionType: 'soft',
              withItem: {
                type: 'wall',
                x: j + 0.5,
                y: i + 0.5
              }
            })
          }
        }
      }
    }
  }
  for (var i = game.items.length - 1; i >= 0; i--) {
    var item = game.items[i]
    var itemX, itemY
    var crushableEnemy = false
    if (item != this && item.type != 'buildings' && (item.type == 'infantry' || item.type == 'vehicles') && Math.abs(item.x - newX) < 4 && Math.abs(item.y - newY) < 4) {
      var crushableEnemy = this.crusher && this.player !== item.player && item.crushable
      if (false) {
        var itemMovement = item.speed / game.gridSize / game.speedAdjustmentFactor
        var itemAngleRadians = item.direction / item.directions * 2 * Math.PI
        itemX = item.x - roundFloating(itemMovement * Math.sin(itemAngleRadians))
        itemY = item.y - roundFloating(itemMovement * Math.cos(itemAngleRadians))
      } else {
        itemX = item.x
        itemY = item.y
      }
      if (Math.pow(itemX - newX, 2) + Math.pow(itemY - newY, 2) < Math.pow((this.hardCollisionRadius + item.hardCollisionRadius) / game.gridSize, 2)) {
        if (crushableEnemy) {
          item.life = 0
          item.infantryDeath = 'die-squish'
        } else {
          collisionObjects.push({
            collisionType: 'hard',
            withItem: item
          })
        }
      } else if (Math.pow(itemX - newX, 2) + Math.pow(itemY - newY, 2) < Math.pow((this.softCollisionRadius + item.hardCollisionRadius) / game.gridSize, 2)) {
        if (crushableEnemy) {
          item.life = 0
          item.infantryDeath = 'die-squish'
        } else {
          collisionObjects.push({
            collisionType: 'soft-hard',
            withItem: item
          })
        }
      } else if (Math.pow(itemX - newX, 2) + Math.pow(itemY - newY, 2) < Math.pow((this.softCollisionRadius + item.softCollisionRadius) / game.gridSize, 2)) {
        if (crushableEnemy) {} else {
          collisionObjects.push({
            collisionType: 'soft',
            withItem: item
          })
        }
      }
    }
  }
  return collisionObjects
}

function roundFloating (number) {
  return Math.round(number * 1e4) / 1e4
}

function findClosestEmptySpot (point, opt) {
  var options = opt || {}
  var x = point.x
  var y = point.y
  for (var radius = options.minimumRadius || 1; radius < 10; radius++) {
    for (var i = -radius; i <= radius; i++) {
      for (var j = radius; j >= -radius; j--) {
        if (Math.abs(i) > radius - 1 && Math.abs(j) > radius - 1 && isEmptySpot({
          x: x + i,
          y: y + j
        })) {
          return {
            x: x + i,
            y: y + j
          }
        }
      }
    }
  }
}

function isEmptySpot (point) {
  if (!(point.x >= 0 && point.x <= game.obstructionGrid[0].length - 1 && point.y >= 0 && point.y <= game.obstructionGrid.length - 1 && !game.obstructionGrid[Math.floor(point.y)][Math.floor(point.x)])) {
    return false
  }
  for (var i = game.vehicles.length - 1; i >= 0; i--) {
    var item = game.vehicles[i]
    if (item != point && Math.abs(point.x - item.x) < 1 && Math.abs(point.y - item.y) < 1) {
      return false
    }
  }
  for (var i = game.infantry.length - 1; i >= 0; i--) {
    var item = game.infantry[i]
    if (item != point && Math.abs(point.x - item.x) < 1 && Math.abs(point.y - item.y) < 1) {
      return false
    }
  }
  for (var i = game.aircraft.length - 1; i >= 0; i--) {
    var item = game.aircraft[i]
    if (item != point && item.z < 1 / 8 && Math.abs(point.x - item.x) < 1 && Math.abs(point.y - item.y) < 1) {
      return false
    }
  }
  return true
}

function moveTo (goal) {
  this.lastMovementX = 0
  this.lastMovementY = 0
  var destination = {
    x: goal.x,
    y: goal.y,
    type: goal.type
  }
  if (destination.type == 'buildings' || destination.type == 'turrets') {
    if (this.name == 'engineer' || this.name == 'commando') {
      destination.y = goal.y + goal.gridShape.length - 0.5
      if (goal.gridShape[0].length == 2) {
        if (this.x < goal.cgX) {
          destination.x = goal.x + 0.5
        } else {
          destination.x = goal.x + 1.5
        }
      } else {
        destination.x = goal.cgX
      }
    } else {
      if (this.y < goal.cgY) {
        destination.y = goal.y + 0.5
      } else {
        destination.y = goal.y + goal.gridShape.length - 0.5
      }
      if (this.x < goal.cgX) {
        destination.x = goal.x + 0.5
      } else {
        destination.x = goal.x + goal.gridShape[0].length - 0.5
      }
    }
  }
  var start = [Math.floor(this.x), Math.floor(this.y)]
  var end = [Math.floor(destination.x), Math.floor(destination.y)]
  if (this.start && this.start.x === start.x && this.start.y === start.y && this.destination && this.destination.x === destination.x && this.destination.y === destination.y && this.path && !game.buildingLandscapeChanged) {} else {
    var grid
    if (game.type == 'singleplayer') {
      if (this.player === game.player) {
        grid = $.extend(true, [], game.foggedObstructionGrid[this.player])
      } else {
        grid = $.extend(true, [], game.obstructionGrid)
      }
    } else {
      grid = $.extend(true, [], game.foggedObstructionGrid[this.player])
    }
    if (destination.type == 'turrets' || destination.type == 'buildings') {
      grid[Math.floor(destination.y)][Math.floor(destination.x)] = 0
    }
    var newDirection
    if (start[1] < 0 || start[1] >= grid.length || start[0] < 0 || start[0] > grid[0].length) {
      this.path = []
      newDirection = findAngle(destination, this, this.directions)
    } else {
      this.path = AStar(grid, start, end, 'Euclidean')
      this.start = start
      this.end = end
      if (this.path.length > 1) {
        newDirection = findAngle(this.path[1], this.path[0], this.directions)
      } else if (start == end && !grid[start[1]][start[0]]) {
        newDirection = findAngle(destination, this, this.directions)
      } else {
        return false
      }
    }
  }
  var collisionObjects = this.checkCollision()
  var movement, angleRadians
  if (collisionObjects.length > 0) {
    this.colliding = true
    if (this.path.length > 0) {
      collisionObjects.push({
        collisionType: 'attraction',
        withItem: {
          x: this.path[1].x + 0.5,
          y: this.path[1].y + 0.5
        }
      })
    }
    var forceVector = {
      x: 0,
      y: 0
    }
    var hardCollision = false
    var softHardCollision = false
    for (var i = collisionObjects.length - 1; i >= 0; i--) {
      var collObject = collisionObjects[i]
      var objectAngleRadians = findAngle(collObject.withItem, this, this.directions) * 2 * Math.PI / this.directions
      var forceMagnitude = 0
      switch (collObject.collisionType) {
        case 'ultra-hard':
          forceMagnitude = 8
          hardCollision = true
          break
        case 'hard':
          forceMagnitude = 3
          hardCollision = true
          break
        case 'soft-hard':
          forceMagnitude = 2
          break
        case 'soft':
          forceMagnitude = 1
          break
        case 'attraction':
          forceMagnitude = -0.25
          break
      }
      forceVector.x += roundFloating(forceMagnitude * Math.sin(objectAngleRadians))
      forceVector.y += roundFloating(forceMagnitude * Math.cos(objectAngleRadians))
    }
    newDirection = findAngle(forceVector, {
      x: 0,
      y: 0
    }, this.directions)
    if (!hardCollision) {
      movement = this.speed / game.gridSize / game.speedAdjustmentFactor
      angleRadians = this.direction / this.directions * 2 * Math.PI
      this.lastMovementX = -roundFloating(movement * Math.sin(angleRadians))
      this.lastMovementY = -roundFloating(movement * Math.cos(angleRadians))
      var newX = this.x + this.lastMovementX
      var newY = this.y + this.lastMovementY
      this.x = newX
      this.y = newY
      this.turnTo(newDirection)
    } else {
      this.turnTo(newDirection)
    }
  } else {
    this.colliding = false
    if (Math.abs(angleDiff(newDirection, this.direction)) < this.directions / 4) {
      movement = this.speed / game.gridSize / game.speedAdjustmentFactor
      if (this.prone) {
        movement = movement / 2
      }
      angleRadians = this.direction / this.directions * 2 * Math.PI
      this.lastMovementX = -roundFloating(movement * Math.sin(angleRadians))
      this.lastMovementY = -roundFloating(movement * Math.cos(angleRadians))
      this.x = this.x + this.lastMovementX
      this.y = this.y + this.lastMovementY
    }
    if (this.direction != newDirection) {
      this.turnTo(newDirection)
    }
  }
  return true
}

function findEnemyInRange () {
  if (!this.primaryWeapon) {
    console.log('why am i looking for enemy if i cant do anything??', this.name, this.orders.type)
    return
  }
  if (this.name == 'commando') {
    return
  }
  var sightBonus = 0
  if (this.type == 'vehicles' || this.type == 'infantry') {
    sightBonus = 1
  }
  if (this.orders && this.orders.type == 'guard') {
    sightBonus = 2
  }
  if (this.orders && this.orders.type == 'area guard') {
    sightBonus = 3
  }
  if (this.orders && this.orders.type == 'hunt') {
    sightBonus = 50
  }
  var range = this.weapon ? this.weapon.range : this.sight
  var rangeSquared = Math.pow(range + sightBonus, 2)
  var lastDistance
  var lastItem = undefined
  var allies = maps.currentMapData.allies ? maps.currentMapData.allies[this.player] : 'None'
  for (var i = 0; i < game.attackableItems.length; i++) {
    var item = game.attackableItems[i]
    if (item.player != this.player && item.player != 'Neutral' && item.player != allies && item.player !== undefined && item.type != 'trees' && item.type != 'walls' && this.canAttackEnemy(item)) {
      var distance = Math.pow((item.cgX || item.x) - this.x, 2) + Math.pow((item.cgY || item.y) - this.y, 2)
      if (distance <= rangeSquared && (!lastItem || lastDistance > distance)) {
        lastDistance = distance
        lastItem = item
      }
    }
  }
  return lastItem
}

function canAttackEnemy (item) {
  if (item == this) {
    return false
  }
  if (item.cloaked) {
    if (this.type == 'infantry' || this.type == 'turrets' || this.type == 'vehicles') {
      var distance = Math.pow((item.cgX || item.x) - this.cgX, 2) + Math.pow((item.cgY || item.y) - this.cgY, 2)
      if (distance > 2.5) {
        return false
      }
    } else {
      return false
    }
  }
  if (item.lifeCode == 'dead') {
    return false
  }
  if (item.type == 'walls' && !warheads[bullets[item.weapon.projectile]].walls) {
    return false
  }
  if (item.type == 'trees' && !warheads[bullets[item.weapon.projectile]].wood) {
    return false
  }
  if (item.type == 'ships' && this.type != 'turrets') {
    return false
  }
  if (item.type == 'aircraft' && item.z > 0 && !this.weapon.canAttackAir) {
    return false
  }
  if ((item.type != 'aircraft' || item.z <= 0) && this.name == 'sam-site') {
    return false
  }
  return true
}

function findAngle (object, unit, directions) {
  var dy = (object.cgY || object.y) - (unit.cgY || unit.y)
  var dx = (object.cgX || object.x) - (unit.cgX || unit.x)
  var angle = wrapDirection(directions / 2 + Math.round(Math.atan2(dx, dy) * directions / (2 * Math.PI)), directions)
  return angle
}

function wrapDirection (direction, directions) {
  if (direction < 0) {
    direction += directions
  }
  if (direction >= directions) {
    direction -= directions
  }
  return direction
}

function addAngle (angle, increment, base) {
  angle = angle + increment
  if (angle > base - 1) {
    angle -= base
  }
  if (angle < 0) {
    angle += base
  }
  return angle
}

function angleDiff (angle1, angle2, directions) {
  if (angle1 >= directions / 2) {
    angle1 = angle1 - directions
  }
  if (angle2 >= directions / 2) {
    angle2 = angle2 - directions
  }
  diff = angle2 - angle1
  if (diff < -directions / 2) {
    diff += directions
  }
  if (diff > directions / 2) {
    diff -= directions
  }
  return diff
}
var multiplayer = {
  websocket_url: 'wss://servers.adityaravishankar.com/command-and-conquer',
  websocket: undefined,
  gameSpeed: 1,
  start: function () {
    $('.messages').html('')
    game.type = 'multiplayer'
    var WebSocketObject = window.WebSocket || window.MozWebSocket
    if (!WebSocketObject) {
      menus.showMessageBox('WebSockets Not Available', 'Your browser does not support HTML5 WebSockets. Multiplayer will not work.', function () {
        menus.show('game-type')
      })
      return
    }
    this.websocket = new WebSocketObject(this.websocket_url)
    this.websocket.onmessage = multiplayer.handleWebSocketMessage
    var connectionErrorMessage = function (evt) {
      if (!game.running) {
        menus.showMessageBox('Multiplayer Server Not Available', 'Problem connecting with C&amp;C-HTML5 multiplayer server. <br><br>The server may either have too many connected players or has been switched off for maintenance.<br><br>Please try again later.', function () {
          menus.show('game-type')
        })
      } else {
        multiplayer.pauseLevel()
        menus.showMessageBox('Connection Lost', 'You have got disconnected from the C&amp;C-HTML5 multiplayer server. <br><br> This may be because of network connectivity issues, or the server may have been switched off for maintenance.', function () {
          menus.show('game-type')
        })
      }
    }
    this.websocket.onclose = connectionErrorMessage
    this.websocket.onerror = connectionErrorMessage
    this.websocket.onopen = function () {
      menus.show('join-network-game')
    }
  },
  gameOptions: function () {
    menus.show('multiplayer-game-options')
  },
  pauseLevel: function () {
    sounds.stopMusic()
    game.running = false
    clearInterval(game.animationInterval)
  },
  handleWebSocketMessage: function (message) {
    var messageObject = JSON.parse(message.data)
    switch (messageObject.type) {
      case 'room_list':
        multiplayer.updateRoomStatus(messageObject.status)
        multiplayer.updatePlayerList()
        break
      case 'latency_ping':
        multiplayer.sendWebSocketMessage({
          type: 'latency_pong',
          userAgent: navigator.userAgent
        })
        break
      case 'system_message':
        var systemMessageHTML = "<p style='color:white'>SYSTEM: " + messageObject.details + '</p>'
        $('.messages').append($(systemMessageHTML))
        multiplayer.showInGameMessages()
        $('.messages').each(function () {
          $(this).animate({
            scrollTop: $(this).prop('scrollHeight')
          })
        })
        sounds.play('system_message')
        break
      case 'lobby_message':
        var lobbyMessageHTML = "<p style='color:" + messageObject.color + "'>" + messageObject.from + ': ' + messageObject.details + '</p>'
        $('#join-network-game-menu-div .messages').append($(lobbyMessageHTML))
        $('.messages').each(function () {
          $(this).animate({
            scrollTop: $(this).prop('scrollHeight')
          })
        })
        if (menus.isActive('join-network-game')) {
          sounds.play('lobby_message')
        }
        break
      case 'chat_message':
        var messageHTML = "<p style='color:" + messageObject.color + "'>" + messageObject.from + ': ' + messageObject.details + '</p>'
        $('.messages').append($(messageHTML))
        multiplayer.showInGameMessages()
        $('.messages').each(function () {
          $(this).animate({
            scrollTop: $(this).prop('scrollHeight')
          })
        })
        if (menus.isActive('start-network-game' || menus.isActive('joined-network-game'))) {
          sounds.play('lobby_message')
        } else {
          sounds.play('chat_message')
        }
        break
      case 'create_new_game_fail':
        menus.showMessageBox('Could Not Create Game', messageObject.details)
        $("#join-network-game-menu-div input[type='button']").attr('disabled', false)
        break
      case 'create_new_game_success':
        multiplayer.playerId = messageObject.playerId
        multiplayer.roomId = messageObject.roomId
        multiplayer.color = messageObject.color
        multiplayer.team = messageObject.team
        menus.show('start-network-game')
        $('.input-message').css('color', multiplayer.color)
        menus.showMessageBox('Game Created', 'New game created (' + messageObject.roomName + '). You need at least one other player to join before starting the game.', function () {
          $('#start-network-game-menu-div .starting-credits').focus()
        })
        break
      case 'join_existing_game_fail':
        menus.showMessageBox('Could Not Join Game', messageObject.details)
        $("#join-network-game-menu-div input[type='button']").attr('disabled', false)
        break
      case 'kicked_from_game':
        menus.show('join-network-game')
        menus.showMessageBox('Kicked Out From Game', messageObject.details)
        break
      case 'join_existing_game_success':
        menus.show('joined-network-game')
        menus.showMessageBox('Game Joined', 'You have joined the game (' + messageObject.roomName + '). Wait for the host to start the game.')
        multiplayer.playerId = messageObject.playerId
        multiplayer.roomId = messageObject.roomId
        multiplayer.color = messageObject.color
        multiplayer.team = messageObject.team
        $('.input-message').css('color', multiplayer.color)
        break
      case 'start_game_fail':
        menus.showMessageBox('Could Not Start Game', messageObject.details)
        $('#start-network-game-menu-div input').attr('disabled', false)
        break
      case 'init_game':
        multiplayer.initializeMultiplayer(messageObject.details)
        break
      case 'start_playing_game':
        multiplayer.startLevel()
        multiplayer.showInGameMessages()
        break
      case 'game_tick':
        multiplayer.lastReceivedTick = messageObject.gameTick
        multiplayer.commands[messageObject.gameTick] = messageObject.commands
        break
      case 'end_defeat':
        multiplayer.endGame('failure')
        break
      case 'end_victory':
        multiplayer.endGame('success')
        break
      case 'report_desync':
        multiplayer.sendDeSyncReport()
        break
      case 'end_desync':
        multiplayer.endGame('desync')
        break
    }
  },
  showInGameMessages: function () {
    if (game.running) {
      $('#gameinterfacescreen .messages').fadeIn()
      $('.messages').each(function () {
        $(this).animate({
          scrollTop: $(this).prop('scrollHeight')
        })
      })
      clearTimeout(multiplayer.chatHideTimeout)
      multiplayer.chatHideTimeout = setInterval(function () {
        $('#gameinterfacescreen .messages').fadeOut(1e3)
      }, 1e4)
    } else {
      $('.messages').each(function () {
        $(this).animate({
          scrollTop: $(this).prop('scrollHeight')
        })
      })
    }
  },
  surrender: function (message) {
    multiplayer.sendWebSocketMessage({
      type: 'surrender'
    })
  },
  saveMission: function () {
    var savedGame = {
      gameTick: game.gameTick,
      player: game.player,
      commands: multiplayer.commands,
      level: multiplayer.currentLevel,
      players: multiplayer.players,
      credits: multiplayer.credits
    }
    localStorage.lastMultiplayerGame = JSON.stringify(savedGame)
    return savedGame
  },
  sendDeSyncReport: function () {
    var report = {
      savedGame: multiplayer.saveMission(),
      items: []
    }
    for (var i = game.items.length - 1; i >= 0; i--) {
      var item = game.items[i]
      report.items.unshift({
        uid: item.uid,
        name: item.name,
        team: item.team,
        player: item.player,
        type: item.type,
        x: item.x,
        y: item.y
      })
    }
    multiplayer.sendWebSocketMessage({
      type: 'desync_report',
      report: report
    })
  },
  updateSavedMissionList: function () {
    var savedGameString = localStorage.lastMultiplayerGame
    if (savedGameString || multiplayer.debugSavedGame) {
      var savedGame
      if (multiplayer.debugSavedGame) {
        savedGame = multiplayer.debugSavedGame
        savedGameString = JSON.stringify(multiplayer.debugSavedGame)
      } else if (savedGameString) {
        savedGame = JSON.parse(savedGameString)
      }
      if (savedGameString) {
        var savedGameDescription = 'Map: ' + maps.multiplayer[savedGame.level] + ' Players: ' + savedGame.players.length
        $('#replay-game-menu-div .mission-list').append("<option value='-1'>[MULTIPLAYER] " + savedGameDescription + '</option>')
      }
    }
  },
  endGame: function (type) {
    multiplayer.pauseLevel()
    multiplayer.websocket.onopen = null
    multiplayer.websocket.onclose = null
    multiplayer.websocket.onerror = null
    multiplayer.websocket.close()
    $('#gameinterfacescreen .messages').hide()
    $('#gameinterfacescreen .input-message').hide()
    menus.show('mission-ended')
    var sweetMessage = '<br><br>If you enjoyed playing this game, please take the time to tell all your friends about C&amp;C - HTML5.'
    multiplayer.saveMission()
    if (type == 'success') {
      sounds.play('mission_accomplished')
      game.showEnding = 'success'
      setTimeout(function () {
        menus.showMessageBox('Victory', 'Congratulations! You have won the match.' + sweetMessage, function () {
          menus.show('game-type')
        })
      }, 3e3)
    } else if (type == 'failure') {
      sounds.play('mission_failure')
      game.showEnding = 'failure'
      setTimeout(function () {
        menus.showMessageBox('Failure', 'You have lost the match.' + sweetMessage, function () {
          menus.show('game-type')
        })
      }, 3e3)
    } else if (type == 'desync') {
      menus.showMessageBox('Game Out of Sync', 'Your game has gone out of sync with the other player. The administrator has been notified and he will review your game as soon as possible. <br><br>If the problem persists, please wait and watch the <a href="http://www.facebook.com/CommandConquerHtml5" target="_blank">C&amp;C - HTML5 Facebook Page</a> for updates.', function () {
        menus.show('game-type')
      })
    }
  },
  startLevel: function () {
    game.gameTick = 0
    multiplayer.commands = []
    sidebar.init()
    multiplayer.resumeLevel()
    sounds.playMusic()
  },
  resumeLevel: function () {
    menus.hide()
    game.running = true
    game.animationInterval = setInterval(multiplayer.animationLoop, game.animationTimeout / game.gameSpeed)
    game.animationLoop()
    game.refreshBackground = true
    game.drawingLoop()
  },
  animationLoop: function () {
    if (game.gameTick <= multiplayer.lastReceivedTick) {
      multiplayer.gameLagging = false
      var commands = multiplayer.commands[game.gameTick]
      if (commands) {
        for (var i = 0; i < multiplayer.commands[game.gameTick].length; i++) {
          var commandObject = commands[i]
          game.receiveCommand(commandObject.uids, commandObject.command)
        }
      }
      game.animationLoop()
      if (!multiplayer.sentCommandForTick) {
        multiplayer.sendCommand()
      }
      game.gameTick++
      multiplayer.sentCommandForTick = false
    } else {
      multiplayer.gameLagging = true
    }
  },
  initializeMultiplayer: function (details) {
    menus.hide()
    game.type = 'multiplayer'
    game.gameSpeed = details.gameSpeed || 1
    multiplayer.currentLevel = details.level
    multiplayer.players = details.players
    multiplayer.credits = details.credits
    var mapName = game.type + '/' + maps[game.type][multiplayer.currentLevel]
    maps.load(mapName, function () {
      multiplayer.sendWebSocketMessage({
        type: 'initialized_game'
      })
    })
  },
  replaySavedLevelInteractive: function (savedGame) {
    game.gameTick = 0
    multiplayer.commands = $.extend(true, [], savedGame.commands)
    game.team = savedGame.player.team
    sidebar.init()
    sounds.muteAudio = false
    menus.hide()
    game.running = true
    game.replay = true
    game.replayTick = savedGame.gameTick
    multiplayer.animationLoopReplay()
    game.refreshBackground = true
    game.drawingLoop()
    this.resumeReplay()
  },
  pauseReplay: function () {
    clearInterval(game.animationInterval)
  },
  exitReplay: function () {
    game.running = false
    game.replay = false
    clearInterval(game.animationInterval)
    menus.show('game-type')
  },
  resumeReplay: function () {
    clearInterval(game.animationInterval)
    game.gameSpeed = 1
    game.animationInterval = setInterval(function () {
      if (game.gameTick <= game.replayTick) {
        multiplayer.animationLoopReplay()
      } else {
        multiplayer.pauseReplay()
      }
    }, game.animationTimeout / game.gameSpeed)
  },
  fastForwardReplay: function () {
    clearInterval(game.animationInterval)
    game.gameSpeed *= 2
    if (game.gameSpeed > 8) {
      game.gameSpeed = 8
    }
    game.animationInterval = setInterval(function () {
      if (game.gameTick <= game.replayTick) {
        multiplayer.animationLoopReplay()
      } else {
        multiplayer.pauseReplay()
      }
    }, game.animationTimeout / game.gameSpeed)
  },
  animationLoopReplay: function () {
    game.gameTick++
    if (multiplayer.commands.length > game.gameTick && multiplayer.commands[game.gameTick]) {
      for (var i = 0; i < multiplayer.commands[game.gameTick].length; i++) {
        var commandObject = multiplayer.commands[game.gameTick][i]
        game.receiveCommand(commandObject.uids, commandObject.command)
      }
    }
    game.animationLoop()
  },
  loadMultiplayerReplay: function (index) {
    menus.hide()
    game.type = 'multiplayer'
    game.gameSpeed = 1
    var savedGame
    if (multiplayer.debugSavedGame) {
      savedGame = multiplayer.debugSavedGame
    } else {
      savedGame = JSON.parse(localStorage.lastMultiplayerGame)
    }
    multiplayer.currentLevel = savedGame.level
    multiplayer.players = savedGame.players
    multiplayer.credits = savedGame.credits
    multiplayer.playerId = savedGame.player
    var mapName = game.type + '/' + maps[game.type][multiplayer.currentLevel]
    maps.load(mapName, function () {
      multiplayer.replaySavedLevelInteractive(savedGame)
    })
  },
  initializeLevel: function (data) {
    game.colorHash = {}
    game.players = []
    game.kills = {}
    game.deaths = {}
    game.cash = {}
    game.player = multiplayer.playerId
    var startingTypes = Object.keys(data.starting).sort()
    for (var st = startingTypes.length - 1; st >= 0; st--) {
      var type = startingTypes[st]
      var startingArray = data.starting[type]
      for (var i = 0; i < startingArray.length; i++) {
        var item = startingArray[i]
        item.type = type
        game.add(item)
      }
    }
    for (var i = 0; i < multiplayer.players.length; i++) {
      var player = multiplayer.players[i]
      game.colorHash[player.playerId] = {
        index: i,
        color: player.color,
        team: player.team
      }
      game.players.push(player.playerId)
      game.kills[player.playerId] = 0
      game.deaths[player.playerId] = 0
      game.cash[player.playerId] = multiplayer.credits
      var spawnLocation = data.spawns[player.spawn]
      if (player.playerId === multiplayer.playerId) {
        game.viewportX = spawnLocation.viewportx * game.gridSize
        game.viewportY = spawnLocation.viewporty * game.gridSize
        multiplayer.averageLatency = player.averageLatency
        game.team = player.team
      }
      var startingUnits = Object.keys(data.startingunits[player.team]).sort()
      for (var su = startingUnits.length - 1; su >= 0; su--) {
        var type = startingUnits[su]
        var startingArray = data.startingunits[player.team][type]
        for (var j = 0; j < startingArray.length; j++) {
          var item = $.extend(true, [], startingArray[j])
          item.type = type
          item.x = item.dx + spawnLocation.x
          item.y = item.dy + spawnLocation.y
          item.player = player.playerId
          item.team = player.team
          game.add(item)
        }
      }
    }
  },
  updateRoomStatus: function (roomStatus) {
    multiplayer.roomStatus = roomStatus
    $('.games-list').empty()
    for (var i = 0; i < multiplayer.roomStatus.length; i++) {
      var room = multiplayer.roomStatus[i]
      $('.games-list').app
