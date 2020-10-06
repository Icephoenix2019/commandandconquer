{
    "name":"scg02ea",
    "briefing": "NOD has a secret base and it is our job to put an end to it.",

    "team":"gdi",
    "player":"GoodGuy",
    "cash" :{
        "GoodGuy":0,
        "BadGuy":0
    },
    "videos" : {
      "briefing":"gdi/gdi1"
    },
    "height":16,
    "width":32,
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
        "turrets":["gun-turret"],
        "buildings":["construction-yard","power-plant","barracks"],
        "walls":["sandbag"],
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

        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":20.75,"y":16,"direction":9,"orders":{"type":"guard"}},
        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":20.75,"y":16.5,"direction":9,"orders":{"type":"guard"}},
        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":21.25,"y":16,"direction":9,"orders":{"type":"guard"}},
        {"name":"minigunner","team":"gdi","player":"GoodGuy","x":21.25,"y":16.5,"direction":9,"orders":{"type":"guard"}}

            ],
        "buildings":[
        ],
        "walls":[
            {"name":"sandbag","team":"nod","player":"BadGuy","x":14,"y":15},
            {"name":"sandbag","team":"nod","player":"BadGuy","x":13,"y":15},
            {"name":"sandbag","team":"nod","player":"BadGuy","x":13,"y":16},
            {"name":"sandbag","team":"nod","player":"BadGuy","x":12,"y":16}
        ],
        "vehicles":[
            {"name":"jeep","team":"gdi","player":"GoodGuy","x":20,"y":14.75,"direction":9}
            {"name":"jeep","team":"gdi","player":"GoodGuy","x":20,"y":15.75,"direction":9}
            ],

        "triggers":[
            {"name":"condition","condition":"(game.count(\"buildings\",\"BadGuy\")==0 && game.count(\"vehicles\",\"BadGuy\")==0 && game.count(\"infantry\",\"BadGuy\") == 0)",
             "action":"success"},
            {"name":"condition","condition":"(game.count(\"vehicles\",\"GoodGuy\")==0 && game.count(\"infantry\",\"GoodGuy\") == 0)",
             "action":"failure"}
    ]
}
