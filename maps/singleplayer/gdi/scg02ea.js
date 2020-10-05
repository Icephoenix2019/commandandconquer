{
    "name":"scg02ea",
    "briefing": "NOD has a secret base in the north, destory it!\nWe have a small task force waiting for you, please be careful.",

    "team":"gdi",
    "player":"GoodGuy",
    "cash" :{
        "GoodGuy":0,
        "BadGuy":500
    },
    "videos" : {
      "briefing":"gdi/gdi1"
    },
    "height":27,
    "width":27,
    "y":3,
    "x":0,
    "theater":"temperate",
    "terrain":{
        "water":[
        ],
        "rocks":[
        ]
    },
    "requirements":{
        "infantry":["minigunner","sniper"],
        "vehicles":["jeep","buggy"],
        "buildings":["construction-yard","power-plant","barracks"],
        "vehicles":["jeep"],
        "trees":["tree-01","tree-02","tree-05","tree-06","tree-07","tree-16","tree-17","tree-cluster-01","tree-cluster-02","tree-cluster-04","tree-cluster-05"]
    },
    "buildable":{
        "infantry":["minigunner","sniper"],

        "buildings":["power-plant","barracks"]
    },
    "starting":{
        "trees":[
            {"name":"tree-01","x":4,"y":12},
            {"name":"tree-01","x":9,"y":7},
            {"name":"tree-01","x":12,"y":7},
            {"name":"tree-06","x":22,"y":6},
            {"name":"tree-07","x":21,"y":6},
            {"name":"tree-07","x":14,"y":9},

            {"name":"tree-02","x":4,"y":9},
            {"name":"tree-02","x":6,"y":13},
            {"name":"tree-02","x":5,"y":15},

            {"name":"tree-05","x":10,"y":11},

            {"name":"tree-cluster-05","x":10,"y":1},
            {"name":"tree-cluster-05","x":21,"y":2},

            {"name":"tree-cluster-04","x":7,"y":4},
            {"name":"tree-cluster-04","x":23,"y":6},

            {"name":"tree-cluster-02","x":13,"y":0},
            {"name":"tree-cluster-02","x":20,"y":5},
            {"name":"tree-cluster-02","x":13,"y":8},
            {"name":"tree-cluster-02","x":9,"y":8},

            {"name":"tree-cluster-01","x":7,"y":2},
            {"name":"tree-cluster-01","x":11,"y":11},
            {"name":"tree-cluster-01","x":24,"y":0}


        ],
        "infantry":[
        {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":0.5,
           "x":5.5,
           "orders":{
             "type":"hunt"
           },
           "direction":3
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":3,
           "x":14,
           "orders":{
             "type":"area guard"
           },
           "direction":3
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":4,
           "x":3,
           "orders":{
             "type":"guard"
           },
           "direction":4
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":4.5,
           "x":2.5,
           "orders":{
             "type":"guard"
           },
           "direction":4
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":8,
           "x":13,
           "orders":{
             "type":"area guard"
           },
           "direction":3
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":12,
           "x":11,
           "orders":{
             "type":"area guard"
           },
           "direction":3
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":6,
           "x":24,
           "orders":{
             "type":"area guard"
           },
           "direction":5
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":3,
           "x":13,
           "orders":{
             "type":"area guard"
           },
           "direction":3
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":3,
           "x":20,
           "orders":{
             "type":"area guard"
           },
           "direction":6
         },
         {
           "player":"BadGuy",
           "team":"nod",
           "name":"minigunner",
           "y":7,
           "x":21,
           "orders":{
             "type":"area guard"
           },
           "direction":5
         },

        {"name":"minigunner","team":"nod","player":"BadGuy","x":1,"y":2,"orders":{"type":"hunt"}},
        {"name":"minigunner","team":"nod","player":"BadGuy","x":2,"y":3,"orders":{"type":"hunt"}},
        {"name":"minigunner","team":"nod","player":"BadGuy","x":3,"y":2,"orders":{"type":"hunt"}},

        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":22.75,"y":16,"direction":0,"orders":{"type":"guard"}},
        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":22.75,"y":16.5,"direction":0,"orders":{"type":"guard"}},
        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":22.25,"y":16,"direction":0,"orders":{"type":"guard"}},
        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":22.25,"y":16.5,"direction":0,"orders":{"type":"guard"}}

            ],
        "buildings":[
            {"name":"power-plant","team":"nod","player":"BadGuy","x":14,"y":20},
            {"name":"power-plant","team":"nod","player":"BadGuy","x":12,"y":20},
            {"name":"construction-yard","team":"nod","player":"BadGuy","x":9,"y":20},
        ],
        "vehicles":[
            {"name":"jeep","team":"gdi","player":"GoodGuy","x":21,"y":14.75,"direction":0}
            {"name":"jeep","team":"gdi","player":"GoodGuy","x":23,"y":14.75,"direction":0}
            ],


        "triggers":[
            {"name":"condition","condition":"(game.count(\"buildings\",\"BadGuy\")==0 && game.count(\"vehicles\",\"BadGuy\")==0 && game.count(\"infantry\",\"BadGuy\") == 0)",
             "action":"success"},
            {"name":"condition","condition":"(game.count(\"buildings\",\"GoodGuy\")==0 && game.count(\"vehicles\",\"GoodGuy\")==0 && game.count(\"infantry\",\"GoodGuy\") == 0)",
             "action":"failure"}


}
