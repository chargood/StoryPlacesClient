This is the storyplaces client.


Configuration of TimeRangeConditions
====================================

within the configurations section of the story json....

```
{
      "name" : "introtimecheck",
      "type" : "timerange",
      "first" : "13:00",
      "last" : "14:00" 
}
```

Configuration of TimePassedCondition
====================================

within the function seciton of the story json....

{
      "name": "introdonetimestamp",
      "type": "settimestamp",
      "arguments": [
        "introdonetimestamp "
      ],
      "conditions": []
},


within the conditions section of the story json...

```
  {
      "name" : "introdonetimesince",
      "type" : "timepassed",
      "tsVariableName" : "introdonetimestamp",
      "minutes" : 10 
  },
```

Setting up optimised code
=========================

Install gulp (`https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md`)

Run `npm install` in the root of the app

Run `gulp default` in the root of the app to compile it all down
