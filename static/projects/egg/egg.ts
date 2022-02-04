
class Vec2 {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.set(x, y);
    }

    mag(): number {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    normalize(): void {
        const mag = this.mag();
        this.x /= mag;
        this.y /= mag;
    }

    add(other: Vec2): void {
        this.x += other.x;
        this.y += other.y;
    }

    sub(other: Vec2): void {
        this.x -= other.x;
        this.y -= other.y;
    }

    muls(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }

    scale(scalar: number): void {
        let mag = this.mag();
        this.x = scalar * this.x / mag;
        this.y = scalar * this.y / mag;
    }

    cross(other: Vec2): number {
        return this.x * other.y - this.y * other.x;
    }
}

let mouse = new Vec2(0, 0);

document.addEventListener("mousemove", (ev: any) => {
    mouse.set( ev.clientX, ev.clientY );
});


class Rect {

    el: HTMLElement;
    size: Vec2;
    opos: Vec2;
    off: Vec2;
    vel: Vec2;
    acc: Vec2;
    rot: number;
    rotv: number;
    torque: number;
    scale: number;

    static ACCEL_RATE: number = 0.08;
    static VEL_MAX: number = 6.5;
    static ROT_ACCEL_MAX: number = 4.08;
    static ROT_ACCEL_SCALE: number = 1.1;
    static ROT_VEL_MAX: number = 0.01;
    static SCALE_MAX: number = 1;
    static SCALE_MIN: number = 0.1;

    constructor(el: HTMLElement) {
        // the DOM element
        this.el = el;

        let bounds = el.getBoundingClientRect();

        // original position
        this.opos = new Vec2(bounds.x, bounds.y);

        // dimensions
        this.size = new Vec2(bounds.width, bounds.height);

        // current position offset
        this.off = new Vec2(0, 0);

        // velocity
        this.vel = new Vec2(0, 0);

        // acceleration
        this.acc = new Vec2(0, 0);

        // rotation
        this.rot = 0;

        // angular velocity
        this.rotv = 0;

        // angular momentum (torque)
        this.torque = 0;

        this.scale = 1;
    }

    updateOriginalPosition() {
        // return to original position, mid-frame
        this.el.style.transform = "none";
        let bounds = this.el.getBoundingClientRect();
        this.opos.set(bounds.x, bounds.y);
    }

    animate() {
        this.updateAccel();
        this.updateVelocity();
        this.updatePos();
        this.updateAngularAccel();
        this.updateAngularVelocity();
        this.updateAngle();
        this.updateTransform();
    }

    // Get the absolute position (original position + offset)
    get pos(): Vec2 {
        return new Vec2(
            this.opos.x + this.off.x,
            this.opos.y + this.off.y,
        );
    }

    updateAngularAccel() {
        let cross = this.pos.cross(mouse) * Rect.ROT_ACCEL_SCALE;
        if (Math.abs(cross) > Rect.ROT_ACCEL_MAX) {
            cross = cross / Math.abs(cross) * Rect.ROT_ACCEL_MAX;
        }
        this.torque = -cross;
    }

    updateAngularVelocity() {
        this.rotv += this.torque;
        if (Math.abs(this.rotv) > Rect.ROT_VEL_MAX) {
            this.rotv = Rect.ROT_VEL_MAX * this.rotv / Math.abs(this.rotv);
        }
    }

    updateAngle() {
        this.rot += this.rotv / 10;
    }

    updateAccel() {
        // get vec2 pointing from center of rect to mouse
        this.acc.set(
            mouse.x - ( this.opos.x + this.off.x + this.size.x / 2 ),
            mouse.y - ( this.opos.y + this.off.y + this.size.y / 2 )
        );

        this.acc.scale(Rect.ACCEL_RATE);
    }

    updateVelocity() {
        this.vel.add(this.acc);

        const mag = this.vel.mag();

        if (mag > Rect.VEL_MAX) {
            this.vel.scale(Rect.VEL_MAX);
        }
    }

    updatePos() {
        this.off.add(this.vel);
    }

    updateTransform() {
        this.el.style.transform = `translate(${ this.off.x }px, ${ this.off.y }px) rotate(${this.rot}rad) scale(${this.scale})`;
    }
}

function animate(rects: Rect[]) {
    requestAnimationFrame(() => animate(rects));

    for (const rect of rects) {
        rect.animate();
    }
}

export function eggify(selector: string) {
    const rects = [...document.querySelectorAll(selector)].map((el: HTMLElement) => new Rect(el));

    document.addEventListener("resize", (ev: any) => {
        rects.forEach(rect => rect.updateOriginalPosition());
    });

    animate(rects);
}
