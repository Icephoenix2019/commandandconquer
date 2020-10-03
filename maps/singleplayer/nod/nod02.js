{
    "name":"nod02",
    "briefing": "In order for the Brotherhood to gain a foothold, we must begin by \neliminating certain elements. Nikoomba, the nearby village's leader, \nis one such element. His views and ours do not coincide, and he \nmust be eliminated.",
    "team":"nod",
    "player":"BadGuy",
    "cash" :{
        "GoodGuy":0,
        "BadGuy":1500
    },
    "videos" : {
      "briefing":"nod/nod1"
    },
    "allies":{
        "GoodGuy":"Neutral",
        "Neutral":"GoodGuy",
        "BadGuy":"None"
    },
    "height":24,
    "width":37  ,
    "y":0,
    "x":10,
    "theater":"desert",
    "terrain":{
        "water":[
            [0,14],[1,14],[2,14],[3,14],[4,14],
            [5,13],[5,14],
            [8,12],[9,12],[10,12],
            [11,9],[11,10],[11,11],
            [12,9],
            [13,9],
            [14,0],[14,1],[14,2],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9]
        ],
        "rocks":[
            [0,15],[0,12],[0,18],
            [1,11],[1,12],[1,13],[1,15],[1,18],
            [2,13],[2,15],[2,18],
            [3,17],[3,18],
            [4,17],[4,18],
            [5,15],[5,16],[5,17],[5,18],
            [6,2],[6,3],[6,4],[6,14],[6,17],[6,18],[6,19],[6,20],[6,21],
            [7,2],[7,3],[7,4],[7,11],[7,17],[7,18],[7,19],[7,20],
            [8,3],[8,4],[8,11],
            [9,3],[9,4],
            [10,0],[10,1],[10,2],[10,3],[10,9],[10,11],[10,13],[10,20],[10,21],
            [11,0],[11,1],[11,12],[11,20],[11,21],
            [12,6],[12,10],[12,12],
            [13,0],[13,1],[13,2],[13,3],[13,4],[13,5],[13,6],[13,7],[13,8],[13,10],[13,16],[13,17],
            [14,16],[14,17],
            [15,0],[15,1],[15,2],[15,3],[15,5],[15,6],[15,7],[15,9],[15,16],[15,17],
            [16,0],[16,16],[16,17],
            [17,12],[17,13],[17,14],[17,15],[17,16],[17,17],
            [18,6],[18,7],[18,8],[18,9],[18,10],[18,11],[18,12],[18,13],[18,14],[18,20],
            [19,6],[19,7],[19,8],[19,9],[19,10],[19,11],[19,20],[19,21],
            [20,5],[20,6],[20,21],
            [21,5],[21,6],
            [22,5],[22,6],[22,11],[22,12],[22,13],[22,14],[22,15],[22,16],
            [23,5],[23,6],[23,11],[23,12],[23,13],[23,14],[23,15],[23,16],
            [24,0],[24,1],[24,2],[24,3],[24,4],[24,5],[24,6],[24,15],[24,16],
            [25,0],[25,1],[25,2],[25,3],[25,4],[25,15],[25,16],
            [26,15],[26,16],
            [27,15],[27,16],
            [28,5],[28,6],[28,7],[28,8],[28,9],[28,15],[28,16],
            [29,4],[29,5],[29,6],[29,7],[29,8],[29,9],[29,10],
            [30,4],
            [32,16],[32,17],[32,18],[32,19],[32,20],
            [34,0],[33,0],[33,14],[33,15],[33,16],[33,17],[33,18],[33,19],
            [34,15],
            [35,7],[35,8],[35,15],
            [36,7],[36,14],[36,15]
        ]
    },
    "requirements":{
        "infantry":["minigunner","civilian-1","civilian-3","civilian-4","civilian-5","civilian-6","civilian-7","civilian-8","civilian-9","civilian-10"],
        "buildings":["civilian-building-20","civilian-building-21","civilian-building-22","civilian-building-23","civilian-building-24","civilian-building-25","civilian-building-26","civilian-building-27","civilian-building-30","power-plant","hand-of-nod"],
        "turrets":[],
        "vehicles":["buggy","jeep"],
        "trees":["desert-tree-08","desert-tree-18"]
    },
    "buildable":{
        "infantry":["minigunner"]
    },
    "starting":{
        "trees":[
            {"name":"desert-tree-08","x":0,"y":3},
            {"name":"desert-tree-08","x":2,"y":9},
            {"name":"desert-tree-08","x":2,"y":11},
            {"name":"desert-tree-08","x":3,"y":11},
            {"name":"desert-tree-08","x":6,"y":7},
            {"name":"desert-tree-08","x":7,"y":15},
            {"name":"desert-tree-18","x":12,"y":2},
            {"name":"desert-tree-18","x":12,"y":7},
            {"name":"desert-tree-08","x":18,"y":16},
            {"name":"desert-tree-08","x":26,"y":0},
            {"name":"desert-tree-08","x":26,"y":1},
            {"name":"desert-tree-08","x":29,"y":15},
            {"name":"desert-tree-08","x":34,"y":22},
            {"name":"desert-tree-08","x":35,"y":10}

        ],
        "infantry":[
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":5,
          "x":19,
          "orders":{
            "type":"hunt"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":4.5,
          "x":19.5,
          "orders":{
            "type":"hunt"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":15,
          "x":8,
          "orders":{
            "type":"area guard"
          },
          "direction":3,
          "uid":-4
        },

        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-3",
          "y":5.5,
          "x":5.5,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-4",
          "y":7,
          "x":9,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-5",
          "y":6,
          "x":8,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-7",
          "y":6,
          "x":9,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-8",
          "y":6,
          "x":6,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-9",
          "y":6,
          "x":7,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-6",
          "y":6,
          "x":7.5,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },

        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":15,
          "x":9,
          "orders":{
            "type":"area guard"
          },
          "direction":0,
          "uid":-2
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":12,
          "x":29,
          "orders":{
            "type":"hunt"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":17,
          "x":20,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":21,
          "x":12,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":20,
          "x":23,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":21,
          "x":13,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-1",
          "y":12,
          "x":5,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },

        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":16,
          "x":31,
          "orders":{
            "type":"area guard"
          },
          "direction":2
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":15,
          "x":7.5,
          "orders":{
            "type":"area guard"
          },
          "direction":3,
          "uid":-3
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":4,
          "x":21,
          "orders":{
            "type":"hunt"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":9,
          "x":26,
          "orders":{
            "type":"area guard"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":19,
          "x":35,
          "orders":{
            "type":"guard"
          },
          "direction":0
        },
        {
          "player":"GoodGuy",
          "team":"gdi",
          "name":"minigunner",
          "y":19,
          "x":36,
          "orders":{
            "type":"guard"
          },
          "direction":0
        },
        {
          "player":"Neutral",
          "team":"civilian",
          "name":"civilian-10",
          "y":2.5,
          "x":8.5,
          "orders":{
            "type":"sticky"
          },
          "uid":-1,
          "direction":4
        },
            {"name":"minigunner","team":"nod","player":"BadGuy","x":2,"y":3},
            {"name":"minigunner","team":"nod","player":"BadGuy","x":2.5,"y":3},
            {"name":"minigunner","team":"nod","player":"BadGuy","x":3,"y":2},
            {"name":"minigunner","team":"nod","player":"BadGuy","x":3,"y":2.5},
            {"name":"minigunner","team":"nod","player":"BadGuy","x":4,"y":3},
            {"name":"minigunner","team":"nod","player":"BadGuy","x":4.5,"y":3},
            {"name":"minigunner","team":"nod","player":"BadGuy","x":5,"y":3},
            {"name":"minigunner","team":"nod","player":"BadGuy","x":5.5,"y":3.5}
            ],
        "vehicles":[
            {"name":"jeep","team":"gdi","player":"GoodGuy","x":32,"y":2.5,"direction":16},
            {"name":"jeep","team":"gdi","player":"GoodGuy","x":33,"y":2.5,"direction":16},
            {"name":"jeep","team":"gdi","player":"GoodGuy","x":32,"y":3.5,"direction":16}
        ],
        "buildings":[
            {"name":"hand-of-nod","team":"nod","player":"BadGuy","x":3,"y":2},
            {"name":"power-plant","team":"nod","player":"BadGuy","x":0,"y":2},
            {"name":"civilian-building-26","player":"Neutral","x":0,"y":7},
            {"name":"civilian-building-26","player":"Neutral","x":5,"y":7}
            ],
        "turrets":[],
        "ships":[],
        "triggers":[
            {"name":"condition","condition":"(game.count(\"vehicles\",\"GoodGuy\")==0 && game.count(\"infantry\",\"GoodGuy\") == 0)",
             "action":"success"},
            {"name":"condition","condition":"(game.count(\"vehicles\",\"BadGuy\")==0 && game.count(\"infantry\",\"BadGuy\") == 0)",
             "action":"failure"},
             {"name":"condition","condition":"(game.count(\"infantry\",\"GoodGuy\",-2)==0 && game.count(\"infantry\",\"GoodGuy\",-3)==0 && game.count(\"infantry\",\"GoodGuy\",-4)==0)",
              "action":"hunt","player":"GoodGuy"},
            {"name":"enter","region":{"x1":26,"y1":10,"x2":28,"y2":14},"player":"BadGuy",
                "action":"add","items":[
                  {"name":"minigunner","team":"gdi","player":"GoodGuy","type":"infantry","x":31.5,"y":25,"orders":{"type":"hunt","to":{"x":31,"y":15},"from":{"x":26,"y":10}}},
                  {"name":"minigunner","team":"gdi","player":"GoodGuy","type":"infantry","x":32,"y":25,"orders":{"type":"hunt","to":{"x":32,"y":15},"from":{"x":26,"y":10}}}
              ]
            },
            {"name":"enter","region":{"x1":29,"y1":15,"x2":32,"y2":16},"player":"BadGuy",
                "action":"add","items":[
                  {"name":"minigunner","team":"gdi","player":"GoodGuy","type":"infantry","x":30,"y":25,"orders":{"type":"hunt","to":{"x":31,"y":15},"from":{"x":26,"y":10}}},
                  {"name":"minigunner","team":"gdi","player":"GoodGuy","type":"infantry","x":30.5,"y":25,"orders":{"type":"hunt","to":{"x":31.5,"y":15},"from":{"x":26,"y":10}}},
                  {"name":"minigunner","team":"gdi","player":"GoodGuy","type":"infantry","x":31,"y":25,"orders":{"type":"hunt","to":{"x":32,"y":15},"from":{"x":26,"y":10}}}

              ]
            },
            {"name":"timed","time":2,"action":"add","items":[
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":31,"y":0.5,"orders":{"type":"move","to":{"x":31,"y":2.5}}},
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":31.5,"y":0.5,"orders":{"type":"move","to":{"x":31.5,"y":2.5}}},
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":31,"y":0,"orders":{"type":"move","to":{"x":31,"y":2}}},
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":31.5,"y":0,"orders":{"type":"move","to":{"x":31.5,"y":2}}}
              ],"reinforcements":true
            },
            {"name":"timed","time":4,"action":"add","items":[
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":32,"y":0.5,"orders":{"type":"move","to":{"x":32,"y":2.5}}},
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":32.5,"y":0.5,"orders":{"type":"move","to":{"x":32.5,"y":2.5}}},
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":32,"y":0,"orders":{"type":"move","to":{"x":32,"y":2}}},
                  {"name":"minigunner","team":"nod","player":"BadGuy","type":"infantry","x":32.5,"y":0,"orders":{"type":"move","to":{"x":32.5,"y":2}}}
              ],"reinforcements":true
            }
        ]
    }


}
