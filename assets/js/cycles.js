var Cycles = {
    data: [],
    categories: [],
    load: function () {
        $.getJSON('https://pepegapi.jeanropke.net/rdo/cycles')
            .done(function (_data) {
                Cycles.categories.date = _data.date;
                Cycles.categories.american_flowers = _data.american_flowers;
                Cycles.categories.card_cups = _data.tarot_cards;
                Cycles.categories.card_pentacles = _data.tarot_cards;
                Cycles.categories.card_swords = _data.tarot_cards;
                Cycles.categories.card_wands = _data.tarot_cards;
                Cycles.categories.lost_bracelet = _data.lost_jewelry;
                Cycles.categories.lost_earrings = _data.lost_jewelry;
                Cycles.categories.lost_necklaces = _data.lost_jewelry;
                Cycles.categories.lost_ring = _data.lost_jewelry;
                Cycles.categories.antique_bottles = _data.antique_bottles;
                Cycles.categories.bird_eggs = _data.bird_eggs;
                Cycles.categories.arrowhead = _data.arrowhead;
                Cycles.categories.family_heirlooms = _data.family_heirlooms;
                Cycles.categories.coin = _data.coin;
                Cycles.categories.random = _data.random;
                Cycles.categories.yesterday = _data.yesterday;
                Cycles.setCustomCycles();
                Cycles.setCycles();
                Cycles.setLocaleDate();
            });
        console.info('%c[Cycles] Loaded!', 'color: #bada55; background: #242424');
    },

    setCustomCycles: function () {

        if (getParameterByName('cycles') == null)
            return;

        if (getParameterByName('cycles').includes(',')) {
            var _cycles = getParameterByName('cycles').split(',');
            if (_cycles.length == 9) {
                if (_cycles.some(isNaN)) {
                    console.warn('Cycles parameters invalid');
                }
                else {
                    Cycles.categories.american_flowers = _cycles[0];
                    Cycles.categories.card_cups = _cycles[1];
                    Cycles.categories.card_pentacles = _cycles[1];
                    Cycles.categories.card_swords = _cycles[1];
                    Cycles.categories.card_wands = _cycles[1];
                    Cycles.categories.lost_bracelet = _cycles[2];
                    Cycles.categories.lost_earrings = _cycles[2];
                    Cycles.categories.lost_necklaces = _cycles[2];
                    Cycles.categories.lost_ring = _cycles[2];
                    Cycles.categories.antique_bottles = _cycles[3];
                    Cycles.categories.bird_eggs = _cycles[4];
                    Cycles.categories.arrowhead = _cycles[5];
                    Cycles.categories.family_heirlooms = _cycles[6];
                    Cycles.categories.coin = _cycles[7];
                    Cycles.categories.random = _cycles[8];
                }

            } else {
                console.warn('Cycles parameters invalid');
            }
        }

    },

    setCycles: function () {
        for (var category in Cycles.categories) {
            $(`input[name=${category}]`).val(Cycles.categories[category]);
        };

        MapBase.addMarkers(true);
    },
    setLocaleDate: function () {
        var _date = Cycles.categories.date.split(' ');

        $('.cycle-data').text(
            Language.get('menu.date')
                .replace('{month}', Language.get(`menu.month.${_date[0]}`))
                .replace('{day}', _date[1])
        );
    },
    checkForUpdate: function () {
        var day = new Date().getUTCDate();

        if (day != Cycles.setLocaleDate())
            $('.map-cycle-alert').removeClass('hidden');
        else
            $('.map-cycle-alert').addClass('hidden');
    },
    isSameAsYesterday: function (category) {
        if (!Cycles.categories.yesterday)
            return;

        var todayCycle = Cycles.categories[category];
        var yesterdayCycle = Cycles.categories.yesterday[Cycles.cyclesNeedsAnotherName(category)];

        return todayCycle == yesterdayCycle;
    },

    cyclesNeedsAnotherName: function (category) {
        switch (category) {
            case "card_cups":
            case "card_pentacles":
            case "card_swords":
            case "card_wands":
                return "tarot_cards";
                break;

            case "lost_bracelet":
            case "lost_earrings":
            case "lost_necklaces":
            case "lost_ring":
                return "lost_jewelry";
                break;

            default:
                return category;
                break;
        }
    },

    getInGameCycle: function (category) {
        var _cycles = [];

        //'old cycle': 'new cycle'
        switch (category) {
            case "arrowhead":
            case "antique_bottles":
            case "lost_bracelet":
            case "lost_earrings":
            case "lost_necklaces":
            case "lost_ring":
                _cycles = {
                    '2': 1,
                    '3': 2,
                    '1': 3,
                    '6': 4,
                    '4': 5,
                    '5': 6
                }
                break;

            case "bird_eggs":
            case "family_heirlooms":
                _cycles = {
                    '2': 1,
                    '3': 2,
                    '1': 3,
                    '6': 4,
                    '5': 5,
                    '4': 6
                }
                break;

            case "coin":
                _cycles = {
                    '2': 1,
                    '3': 2,
                    '1': 3,
                    '4': 4,
                    '6': 5,
                    '5': 6
                }
                break;
            case "card_cups":
            case "card_pentacles":
            case "card_swords":
            case "card_wands":
            case "american_flowers":
                _cycles = {
                    '2': 1,
                    '3': 2,
                    '1': 3,
                    '4': 4,
                    '5': 5,
                    '6': 6
                }
                break;

            default:
                console.log(`Category '${category}' invalid`);
                break;
        }
        return _cycles;
    },
    getCycleColor: function (cycle) {
        var color = "";
        switch (cycle) {
            case 1:
                color = "#35a0d0";
                break;
            case 2:
                color = "#ef932f";
                break;
            case 3:
                color = "#c74db0";
                break;
            case 4:
                color = "#573767";
                break;
            case 5:
                color = "#993033";
                break;
            case 6:
                color = "#005f9a";
                break;
        }
        return color;
    },
    exportTable: function (inGameCycles = false, toPrint = false) {
        var _tempTable = new Object();
        $.each(Cycles.categories.cycles, function (key, value) {
            _tempTable[key] = new Object();
            $.each(value, function (_k, _c) {
                if (_k == "card_pentacles" || _k == "card_swords" || _k == "card_wands" ||
                    _k == "lost_bracelet" || _k == "lost_earrings" || _k == "lost_necklaces")
                    return;
                _tempTable[key][[_k]] = inGameCycles ? Cycles.getInGameCycle(_k)[_c] : _c;
            });
        });

        if (toPrint) {
            $('body').empty();
            var cols = [];
            for (var k in _tempTable) {
                for (var c in _tempTable[k]) {
                    if (cols.indexOf(c) === -1) cols.push(c);
                }
            }
            var html = '<table class="cycle-table"><thead><tr><th></th>' +
                cols.map(function (c) { return '<th>' + c + '</th>' }).join('') +
                '</tr></thead><tbody>';
            for (var l in _tempTable) {
                html += '<tr><th>' + l + '</th>' + cols.map(function (c) { return '<td bgcolor="' + Cycles.getCycleColor(_tempTable[l][c]) + '">' + (_tempTable[l][c] || '') + '</td>' }).join('') + '</tr>';
            }
            html += '</tbody></table>';
            $('body').append(html);
        }
        else {
            console.table(_tempTable);
        }
    }
}

// show alert when cycles are not up to date
//setInterval(function () {
//    Cycles.checkForUpdate();
//}, 1000 * 60);