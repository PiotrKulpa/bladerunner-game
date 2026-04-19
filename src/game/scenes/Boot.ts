import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    create ()
    {
        const startPreloader = () => this.scene.start('Preloader');

        if ('fonts' in document)
        {
            Promise.all([
                document.fonts.load('1em "VT323"'),
                document.fonts.load('1em "BladeRunner"')
            ]).then(startPreloader).catch(startPreloader);

            return;
        }

        startPreloader();
    }
}
