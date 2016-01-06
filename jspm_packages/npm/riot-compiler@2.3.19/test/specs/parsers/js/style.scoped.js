/* */ 
"format cjs";
riot.tag2('style-test', '<header> <h1>{title1}</h1> <h2>{title2}</h2> <a class="button"><i class="twitter"></i> Twitter</a> </header> <h3 id="id">{title3}</h3> <ul> <li>Apple</li> <li>Orange</li> </ul>', 'style-test h1,[riot-tag="style-test"] h1 { font-size: 150% } style-test #id,[riot-tag="style-test"] #id { color: #f00 } style-test header a.button:hover,[riot-tag="style-test"] header a.button:hover { text-decoration: none } style-test h2,[riot-tag="style-test"] h2,style-test h3,[riot-tag="style-test"] h3 { border-bottom: 1px solid #000 } style-test i[class=twitter],[riot-tag="style-test"] i[class=twitter] { background: #55ACEE } style-test a:after,[riot-tag="style-test"] a:after { content: \'\\25BA\' } style-test header,[riot-tag="style-test"] header { text-align: center; background: rgba(0,0,0,.2); } style-test,[riot-tag="style-test"] { display: block } style-test > ul,[riot-tag="style-test"] > ul { padding: 0 } @font-face { font-family: \'FontAwesome\' } @media (min-width: 500px) { style-test header,[riot-tag="style-test"] header { text-align: left; } }', '', function(opts) {
    this.title1 = 'This is an example with Scoped-CSS.'
    this.title2 = 'KORE-WA-Scoped-CSS-NO-SAMPLE=DESU'
    this.title3 = 'List of fruits'
}, '{ }');