Pumpkin
=======

User moderated open commenting system

Arthors: Peter Le Bek
peter@hyperplex.org

Fahd Ananta
f.ananta@gmail.com

Xiwei Yin (Raymond)
raymondxiwei@gmail.com

Zheng Xiong (Lionheart)
lionheart.xiong@gmail.com

# API Endpoints #

## Get all topics - /topic/all ##

#### Attributes ####
|||
|---|---|
| **Path** | /topic/all |
| **HTTP Method** | GET |

#### Parameters ####
_None_

#### Response ####
JSON of all topics and replies.

||JSON format|
|---|---|
| **Topic** | ```{ "id": topic_id, "text": text, "link": link, "weight": 0, "replies": {} }``` |
| **Reply** | ```{ "id": reply_id, "text": text, "votes": 0, "weight": 0, "replies": {}, "children_ids": [] }``` |

#### Example ####
|||
|---|---|
| **Request** | ```$.get('http://127.0.0.1:8000/topic/all')``` |
| **Response** | ```{"0":{"id":0,"text":"Cool search engine","link":"http://google.com","weight":0,```|
||```"replies":{"1":{"id":1,"text":"just a reply","votes":0,"weight":0,"replies":{},"children_ids":[]}}}}``` |

## Add new topic - /topic/add ##
|||
|---|---|
| **Path**     | /topic/add |
| **HTTP Method**     | POST |

#### Parameters ####
|||
|---|---|
| **text** | 140 character maximum text |
| **link** | URL |

Format: ```/topic/add?text=yourtext&link=yourlink```

#### Response ####
JSON of topic added.

||JSON format|
|---|---|
| **Topic** | ```{ "id": topic_id, "text": text, "link": link, "weight": 0, "replies": {} }``` |

#### Example ####
|||
|---|---|
| **Request** | ```$.post('http://127.0.0.1:8000/topic/add?text=yourtext&link=yourlink')``` |
| **Response** | ```{"id":3,"text":"yourtext","link":"yourlink","weight":0,"replies":{}}```|

## Get all replies for a specified topic - /topic/reply/all##
|||
|---|---|
| **Path**     | /topic/reply/all |
| **HTTP Method**     | GET |

#### Parameters ####
|||
|---|---|
| **topicid** | Valid existing topic ID |

Format: ```/topic/reply/all?topicid=XX```

#### Response ####
JSON of all replies for specified topic.

||JSON format|
|---|---|
| **Reply** | ```{ "id": reply_id, "text": text, "votes": 0, "weight": 0, "replies": {}, "children_ids": [] }``` |

#### Example ####
|||
|---|---|
| **Request** | ```$.get('http://127.0.0.1:8000/topic/reply/all?topicid=0')``` |
| **Response** | ```{"1":{"id":1,"text":"just a reply","votes":0,"weight":0,"replies":{},"children_ids":[]}}```|

## Add a new reply - /topic/reply/add ##
|||
|---|---|
| **Path**     | /topic/reply/add |
| **HTTP Method**     | POST |

#### Parameters ####
|||
|---|---|
| **topicid** | Valid existing topic ID |
| **parentid** *(optional)* | ID of reply this is in response to (ie. parent reply). Not needed for direct reply to topic. |
| **text** | Reply content |

Format: ```/topic/reply/add?topicid=XX&parentid=YY&text=ZZ```

#### Response ####
JSON of all reply added.

||JSON format|
|---|---|
| **Reply** | ```{ "id": reply_id, "text": text, "votes": 0, "weight": 0, "replies": {}, "children_ids": [] }``` |

#### Example ####
|||
|---|---|
| **Request** | ```$.post('http://127.0.0.1:8000/topic/reply/add?topicid=0&text=yourreplytext')``` |
| **Response** | ```{"id":4,"text":"yourreplytext","votes":0,"weight":0,"replies":{},"children_ids":[]}```|

## Vote for a reply - /topic/reply/upvote ##
|||
|---|---|
| **Path**     | /topic/reply/upvote |
| **HTTP Method**     | POST |

#### Parameters ####
|||
|---|---|
| **topicid** | Valid existing topic ID |
| **replyid** | ID of reply for which the vote is being registered |

Format: ```/topic/reply/upvote?topicid=XX&replyid=YY```

#### Response ####
Plain text: ```success```

||JSON format|
|---|---|
| **Reply** | ```{ "id": reply_id, "text": text, "votes": 0, "weight": 0, "replies": {}, "children_ids": [] }``` |

#### Example ####
|||
|---|---|
| **Request** | ```$.post('http://127.0.0.1:8000/topic/reply/upvote?topicid=0&replyid=4')``` |
| **Response** | ```success```|
