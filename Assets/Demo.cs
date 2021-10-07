using System.Collections.Generic;
using UnityEngine;
using System;

using Microsoft.ClearScript;
using Microsoft.ClearScript.JavaScript;
using Microsoft.ClearScript.V8;
using System.IO;

public class Demo : MonoBehaviour
{
    private V8ScriptEngine engine;

    // Start is called before the first frame update
    void Start()
    {
        engine = new V8ScriptEngine(V8ScriptEngineFlags.EnableDynamicModuleImports);

        engine.DocumentSettings.AccessFlags |= DocumentAccessFlags.EnableAllLoading;

        // expose a host type
        engine.AddHostType("Debug", typeof(Debug));

        // call a script function
        //engine.Execute("function print(x) { Debug.Log(x); }");
        //engine.Script.print(DateTime.Now.DayOfWeek);

        //// examine a script object
        //engine.Execute("person = { name: 'Fred', age: 5 }");
        //Debug.Log(engine.Script.person.name);

 
        engine.DocumentSettings.AddSystemDocument("./test", ModuleCategory.CommonJS, File.ReadAllText(Application.dataPath + "/test.js"));
        engine.DocumentSettings.AddSystemDocument("Utility", ModuleCategory.CommonJS, File.ReadAllText(Application.dataPath + "/Utility.js"));
    }

    /**
     * @param points 控制点，点的个数代表贝塞尔曲线的阶数
     * @param t 0到1的时间值
     */
    // https://en.wikipedia.org/wiki/B%C3%A9zier_curve
    // https://www.jasondavies.com/animated-bezier/
    public static Vector3 GetBezierLerpPoint(Vector3[] points, float t) {

        var n = points.Length;

        var factors = new List<int>(20);
        for (var i = 0; i < 20; i++)
            factors.Add(0);

        factors[0] = 1;

        for (var i = 2; i < n + 1; i++)
        {

            var last = new List<int>(factors);

            factors[0] = 1;

            factors[i - 1] = 1;

            for (var k = 0; k < last.Count - 1; k++)
            {
                factors[k + 1] = last[k] + last[k + 1];
            }
        }

        var p = new Vector3();

        for (var i = 0; i < n; i++)
        {

            var value = factors[i] * Math.Pow(1 - t, n - 1 - i) * Math.Pow(t, i);
            p += points[i] * (float)value;
        }

        return p;
    }

    /**
     * @param points 控制点，点的个数代表贝塞尔曲线的阶数
     * @param amount 曲线的点数量，数值越大，得到的曲线越平滑
     */
    public static Vector3[] GetBezierPoints(Vector3[] points, int amount)
    {
        var curve = new List<Vector3>();

        for (var i = 0; i < amount; i++)
        {

            curve.Add(GetBezierLerpPoint(points, 1.0f * i / (amount - 1)));
        }

        return curve.ToArray();
    }

    // Update is called once per frame
    void Update()
    {
        dynamic getBezierPoints = engine.Evaluate(new DocumentInfo { Category = ModuleCategory.CommonJS }, @"
                return require('Utility').Utility.getBezierPoints
                //return require('./test').Test.add
            ");

        var list = new List<Vector3>();
        for (var i = 0; i < transform.childCount; i++)
        {
            list.Add(transform.GetChild(i).position);
        }

        var result = getBezierPoints(list.ToArray(), 200);

        for (var i = 0; i < result.length - 1; i++)
        {
            var start = new Vector3((float)result[i].x, (float)result[i].y, (float)result[i].z);
            var end = new Vector3((float)result[i + 1].x, (float)result[i + 1].y, (float)result[i + 1].z);
            Debug.DrawLine(start, end, Color.red);
        }
    }
}
