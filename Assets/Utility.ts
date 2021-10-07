import { Test } from "./test";

class Vec3
{
    public x:number;
    public y:number;
    public z:number;

    public constructor(x:number = 0, y:number = 0, z:number = 0){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public clone(){
        return new Vec3(this.x, this.y, this.z);
    }

    public multiplyScalar(value:number){
        this.x *= value;
        this.y *= value;
        this.z *= value;

        return this;
    }

    public add(other:Vec3){
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;

        return this;
    }
}

export class Utility {

    /**
     * @param points 控制点，点的个数代表贝塞尔曲线的阶数
     * @param t 0到1的时间值
     */
    // https://en.wikipedia.org/wiki/B%C3%A9zier_curve
    // https://www.jasondavies.com/animated-bezier/
    public static getBezierLerpPoint(points: Vec3[], t: number): Vec3 {

        const array = points;
        points = [];

        for(let i = 0; i < array.Length; i++)
        {
            points.push(new Vec3(array[i].x, array[i].y, array[i].z));
        }

        const n = points.length;

        const factors = [1];

        for (let i = 2; i < n + 1; i++) {

            let last = factors.slice(0);

            factors[0] = 1;

            factors[i - 1] = 1;

            for (let i = 0; i < last.length - 1; i++) {
                factors[i + 1] = last[i] + last[i + 1];
            }
        }

        let p:Vec3 = new Vec3();

        for (let i = 0; i < n; i++) {

            let value = factors[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i);
            p.add(points[i].clone().multiplyScalar(value));
        }

        return p;
    }

    /**
     * @param points 控制点，点的个数代表贝塞尔曲线的阶数
     * @param amount 曲线的点数量，数值越大，得到的曲线越平滑
     */
    public static getBezierPoints(points: Vec3[], amount: number): Vec3[] {

        const curve: Vec3[] = [];

        for (let i = 0; i < amount; i++) {

            curve.push(Utility.getBezierLerpPoint(points, i / (amount - 1)));
        }

        return curve;
    }
}
