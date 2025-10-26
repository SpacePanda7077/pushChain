export class WeaponObject {
    gunDamage: number;
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
    gun: Phaser.GameObjects.Sprite;
    isDamaging: boolean;
    isThrowable: boolean;
    ammoCount: number;
    maxAmmo: number;
    fireRate: number;
    type: string;
    reloadTime: number;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        weaponData: {
            damage: number;
            fireRate: number;
            type: string;
            texture: string;
            ammoCount: number;
            reloadTime: number;
        }
    ) {
        this.gunDamage = weaponData.damage;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = weaponData.type;
        this.texture = weaponData.texture;
        this.ammoCount = weaponData.ammoCount || 0;
        this.fireRate = weaponData.fireRate;
        this.maxAmmo = weaponData.ammoCount;
        this.reloadTime = weaponData.reloadTime;
    }
}

